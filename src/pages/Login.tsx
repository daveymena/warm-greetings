import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { DollarSign, Loader2, Shield, TrendingUp, Users } from 'lucide-react';
import { authApi } from '@/lib/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await authApi.login({ email, password });
            
            login(data.token, data.user);
            toast.success(data.message || `Bienvenido de nuevo, ${data.user.name}`);
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Benefits */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 items-center justify-center">
                <div className="max-w-md space-y-8">
                    <div>
                        <div className="flex items-center mb-6">
                            <DollarSign className="h-10 w-10 mr-3" />
                            <span className="text-3xl font-bold">RapiCrédito</span>
                        </div>
                        <h2 className="text-4xl font-bold mb-4">
                            Bienvenido de vuelta
                        </h2>
                        <p className="text-xl text-blue-100">
                            Accede a tu panel de control y gestiona tu negocio financiero de manera profesional.
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <TrendingUp className="h-6 w-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Dashboard Intuitivo</h3>
                                <p className="text-blue-100">Visualiza todas tus métricas importantes de un vistazo</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <Users className="h-6 w-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Gestión de Clientes</h3>
                                <p className="text-blue-100">Administra tu cartera de clientes de forma eficiente</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <Shield className="h-6 w-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Datos Seguros</h3>
                                <p className="text-blue-100">Tu información está protegida con los más altos estándares</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 lg:w-1/2">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                </div>

                <Card className="w-full max-w-md z-10 border-white/40 shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4 lg:hidden">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
                            Iniciar Sesión
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600">
                            Accede a tu panel de administración
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white/70 border-gray-200 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
                                    <Link to="#" className="text-sm text-blue-600 hover:underline">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-white/70 border-gray-200 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full h-11 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <p className="text-gray-600">
                                ¿No tienes una cuenta?{' '}
                                <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                        <div className="mt-4 text-center">
                            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                                ← Volver al inicio
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
