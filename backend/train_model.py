import kagglehub
import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score
import numpy as np
from PIL import Image


def main():
    print("Starting improved model training with better architecture...")

    # Download dataset
    print("Downloading dataset...")
    path = kagglehub.dataset_download("paultimothymooney/chest-xray-pneumonia")
    print(f"Dataset downloaded to: {path}")

    # Device configuration
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # Paths
    train_folder = os.path.join(path, 'chest_xray/train/')
    val_folder = os.path.join(path, 'chest_xray/val/')
    test_folder = os.path.join(path, 'chest_xray/test/')

    # Hyperparameters
    batch_size = 32
    num_epochs = 12
    learning_rate = 0.001
    image_size = 150  # Increased image size for better feature extraction

    # Data transforms
    train_transforms = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.RandomAffine(degrees=30, translate=(0.1, 0.1), scale=(0.8, 1.2)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
    ])

    val_test_transforms = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
    ])

    print("Loading datasets...")
    train_dataset = datasets.ImageFolder(train_folder, transform=train_transforms)
    val_dataset = datasets.ImageFolder(val_folder, transform=val_test_transforms)
    test_dataset = datasets.ImageFolder(test_folder, transform=val_test_transforms)

    # Print class mapping to understand label order
    print(f"Class mapping: {train_dataset.class_to_idx}")
    print(f"Classes: {train_dataset.classes}")
    print(f"Number of classes: {len(train_dataset.classes)}")

    train_loader = DataLoader(
        train_dataset, batch_size=batch_size, shuffle=True,
        num_workers=0, pin_memory=torch.cuda.is_available()
    )
    val_loader = DataLoader(
        val_dataset, batch_size=batch_size, shuffle=False,
        num_workers=0, pin_memory=torch.cuda.is_available()
    )
    test_loader = DataLoader(
        test_dataset, batch_size=batch_size, shuffle=False,
        num_workers=0, pin_memory=torch.cuda.is_available()
    )

    print("Initializing improved model...")
    class PneumoniaCNN(nn.Module):
        def __init__(self):
            super(PneumoniaCNN, self).__init__()
            self.features = nn.Sequential(
                nn.Conv2d(3, 32, kernel_size=3, padding=1),
                nn.ReLU(),
                nn.BatchNorm2d(32),
                nn.MaxPool2d(2, 2),

                nn.Conv2d(32, 64, kernel_size=3, padding=1),
                nn.ReLU(),
                nn.Dropout(0.1),
                nn.BatchNorm2d(64),
                nn.MaxPool2d(2, 2),

                nn.Conv2d(64, 64, kernel_size=3, padding=1),
                nn.ReLU(),
                nn.BatchNorm2d(64),
                nn.MaxPool2d(2, 2),

                nn.Conv2d(64, 128, kernel_size=3, padding=1),
                nn.ReLU(),
                nn.Dropout(0.2),
                nn.BatchNorm2d(128),
                nn.MaxPool2d(2, 2),

                nn.Conv2d(128, 256, kernel_size=3, padding=1),
                nn.ReLU(),
                nn.Dropout(0.2),
                nn.BatchNorm2d(256),
                nn.MaxPool2d(2, 2),
            )
            # Calculate the correct input size for the linear layer
            # 150x150 -> 75x75 -> 37x37 -> 18x18 -> 9x9 -> 4x4
            # So the final feature map is 256 * 4 * 4 = 4096
            self.classifier = nn.Sequential(
                nn.Linear(256 * 4 * 4, 128),
                nn.ReLU(),
                nn.Dropout(0.2),
                nn.Linear(128, 1),
                nn.Sigmoid()
            )

        def forward(self, x):
            x = self.features(x)
            x = x.view(x.size(0), -1)
            return self.classifier(x)

    model = PneumoniaCNN().to(device)
    criterion = nn.BCELoss()
    optimizer = optim.RMSprop(model.parameters(), lr=learning_rate)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer,
        mode='max',
        factor=0.3,
        patience=2,
        min_lr=1e-6,
        verbose=True
    )

    best_val_acc = 0.0
    best_model_state = None

    print("Starting training...")
    for epoch in range(num_epochs):
        # Training
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        all_labels = []
        all_preds = []

        for images, labels in train_loader:
            images = images.to(device)
            labels = labels.unsqueeze(1).float().to(device)

            optimizer.zero_grad()
            outputs = model(images).squeeze()
            loss = criterion(outputs, labels.view(-1))
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            preds = (outputs > 0.5).float()
            correct += (preds == labels.squeeze()).sum().item()
            total += labels.size(0)
            all_labels.extend(labels.squeeze().cpu().numpy())
            all_preds.extend(preds.cpu().numpy())

        epoch_loss = running_loss / len(train_loader.dataset)
        train_acc = correct / total * 100
        train_precision = precision_score(all_labels, all_preds)
        train_recall = recall_score(all_labels, all_preds)
        train_f1 = f1_score(all_labels, all_preds)

        # Validation
        model.eval()
        val_correct = 0
        val_total = 0
        val_labels = []
        val_preds = []
        with torch.no_grad():
            for images, labels in val_loader:
                images = images.to(device)
                labels = labels.unsqueeze(1).float().to(device)
                outputs = model(images).squeeze()
                preds = (outputs > 0.5).float()
                val_correct += (preds == labels.squeeze()).sum().item()
                val_total += labels.size(0)
                val_labels.extend(labels.squeeze().cpu().numpy())
                val_preds.extend(preds.cpu().numpy())

        val_acc = val_correct / val_total * 100
        val_precision = precision_score(val_labels, val_preds)
        val_recall = recall_score(val_labels, val_preds)
        val_f1 = f1_score(val_labels, val_preds)
        scheduler.step(val_acc)

        print(f"Epoch {epoch+1}/{num_epochs} - "
              f"Train Loss: {epoch_loss:.4f} - "
              f"Train Acc: {train_acc:.2f}% - "
              f"Val Acc: {val_acc:.2f}% - "
              f"Train F1: {train_f1:.2f} - Val F1: {val_f1:.2f}")

        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            best_model_state = model.state_dict()

    # Load best model
    if best_model_state is not None:
        model.load_state_dict(best_model_state)

    print("Testing improved model...")
    model.eval()
    test_correct = 0
    test_total = 0
    test_labels = []
    test_preds = []
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            labels = labels.unsqueeze(1).float().to(device)
            outputs = model(images).squeeze()
            preds = (outputs > 0.5).float()
            test_correct += (preds == labels.squeeze()).sum().item()
            test_total += labels.size(0)
            test_labels.extend(labels.squeeze().cpu().numpy())
            test_preds.extend(preds.cpu().numpy())

    test_acc = test_correct / test_total * 100
    test_precision = precision_score(test_labels, test_preds)
    test_recall = recall_score(test_labels, test_preds)
    test_f1 = f1_score(test_labels, test_preds)
    cm = confusion_matrix(test_labels, test_preds)
    print(f"Test Accuracy: {test_acc:.2f}%  Precision: {test_precision:.2f}  Recall: {test_recall:.2f}  F1: {test_f1:.2f}")
    print(f"Confusion Matrix:\n{cm}")

    print("Saving improved model...")
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pneumonia_detection_model.pth")
    torch.save(model.state_dict(), model_path)
    print(f"Model saved to: {model_path}")

    print("Improved training complete!")

if __name__ == '__main__':
    main()
