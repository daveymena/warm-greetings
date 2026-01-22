import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        dateOfBirth: true,
        gender: true,
        occupation: true,
        company: true,
        bio: true,
        notifications: true,
        emailUpdates: true,
        twoFactorAuth: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error al obtener el perfil', error: errorMessage });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      country,
      dateOfBirth,
      gender,
      occupation,
      company,
      bio,
      notifications,
      emailUpdates,
      twoFactorAuth
    } = req.body;

    const updateData: any = {
      updatedAt: new Date()
    };

    // Only update fields that are provided
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (gender !== undefined) updateData.gender = gender;
    if (occupation !== undefined) updateData.occupation = occupation;
    if (company !== undefined) updateData.company = company;
    if (bio !== undefined) updateData.bio = bio;
    if (notifications !== undefined) updateData.notifications = notifications;
    if (emailUpdates !== undefined) updateData.emailUpdates = emailUpdates;
    if (twoFactorAuth !== undefined) updateData.twoFactorAuth = twoFactorAuth;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        dateOfBirth: true,
        gender: true,
        occupation: true,
        company: true,
        bio: true,
        notifications: true,
        emailUpdates: true,
        twoFactorAuth: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json({ message: 'Perfil actualizado exitosamente', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error al actualizar el perfil', error: errorMessage });
  }
});

// Upload avatar
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
    }

    // Get current user to delete old avatar
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { avatar: true }
    });

    // Delete old avatar file if exists
    if (currentUser?.avatar) {
      const oldAvatarPath = path.join(process.cwd(), currentUser.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user with new avatar path
    const avatarPath = `uploads/avatars/${req.file.filename}`;
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { 
        avatar: avatarPath,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      }
    });

    res.json({ 
      message: 'Avatar actualizado exitosamente', 
      user,
      avatarUrl: `/${avatarPath}`
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error al subir el avatar', error: errorMessage });
  }
});

// Delete avatar
router.delete('/avatar', authenticateToken, async (req, res) => {
  try {
    // Get current user to delete avatar file
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { avatar: true }
    });

    // Delete avatar file if exists
    if (currentUser?.avatar) {
      const avatarPath = path.join(process.cwd(), currentUser.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Update user to remove avatar
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { 
        avatar: null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      }
    });

    res.json({ message: 'Avatar eliminado exitosamente', user });
  } catch (error) {
    console.error('Error deleting avatar:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error al eliminar el avatar', error: errorMessage });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Se requiere la contraseña actual y la nueva' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { 
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error changing password:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error al cambiar la contraseña', error: errorMessage });
  }
});

// Delete account
router.delete('/me', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Se requiere la contraseña para eliminar la cuenta' });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Delete avatar file if exists
    if (user.avatar) {
      const avatarPath = path.join(process.cwd(), user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Delete user (this will cascade delete loans and payments)
    await prisma.user.delete({
      where: { id: req.user.userId }
    });

    res.json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting account:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error al eliminar la cuenta', error: errorMessage });
  }
});

export default router;