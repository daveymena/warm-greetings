import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validaciones básicas
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Ya existe un usuario con este email' });
        }

        // Verificar si es el primer usuario (será admin automáticamente)
        const userCount = await prisma.user.count();
        const isFirstUser = userCount === 0;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: isFirstUser ? 'ADMIN' : 'USER',
            },
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        const response = { 
            token, 
            user: { 
                id: user.id, 
                email: user.email, 
                name: user.name, 
                role: user.role 
            },
            message: isFirstUser ? 'Cuenta de administrador creada exitosamente' : 'Usuario registrado exitosamente'
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Error al crear el usuario', error: errorMessage });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                email: user.email, 
                name: user.name, 
                role: user.role 
            },
            message: 'Inicio de sesión exitoso'
        });
    } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Error al iniciar sesión', error: errorMessage });
    }
});

export default router;
