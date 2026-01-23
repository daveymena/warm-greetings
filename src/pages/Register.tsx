import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Shield, CheckCircle, ArrowRight, Sparkles, Zap, BarChart3 } from 'lucide-react';
import { authApi } from '@/lib/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authApi.register({ name, email, password });
      login(data.token, data.user);
      toast.success(data.message || `¡Bienvenido a Rapi-Credi, ${data.user.name}!`);

      if (data.user.role === 'ADMIN') {
        toast.success('¡Felicidades! Eres el administrador principal');
      }

      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Control total de préstamos y clientes',
    'Dashboard con métricas en tiempo real',
    'Alertas automáticas de cobros',
    'Respaldo automático de datos',
    'Soporte técnico incluido',
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 relative">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 p-2.5 shadow-lg">
                <img src="/logo.png" alt="Rapi-Credi" className="h-full w-full object-contain" />
              </div>
              <div className="lg:hidden">
                <span className="text-2xl font-bold tracking-tight text-foreground">Rapi-Credi</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-0 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-2">
              <div className="flex justify-center mb-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm text-success font-medium">
                  <Zap className="h-4 w-4" />
                  <span>Prueba gratuita de 14 días</span>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Crea tu cuenta
              </CardTitle>
              <CardDescription className="text-base">
                Comienza a gestionar préstamos en minutos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nombre Completo</Label>
                  <Input
                    id="name"
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 rounded-xl border-2 border-border/50 bg-background focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl border-2 border-border/50 bg-background focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-xl border-2 border-border/50 bg-background focus:border-primary/50 transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-primary hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Crear Cuenta Gratis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Al registrarte, aceptas nuestros{' '}
                <Link to="#" className="text-primary hover:underline">Términos de Servicio</Link>
                {' '}y{' '}
                <Link to="#" className="text-primary hover:underline">Política de Privacidad</Link>
              </p>

              <div className="mt-6 text-center space-y-4">
                <p className="text-muted-foreground">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Inicia Sesión
                  </Link>
                </p>
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ← Volver al inicio
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Benefits Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-bl from-slate-900 via-primary/90 to-accent" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-pattern-grid opacity-5" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white w-full">
          <div className="max-w-lg space-y-8 ml-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm border border-white/20">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span>+500 empresas confían en nosotros</span>
              </div>
              <h2 className="text-4xl font-bold leading-tight">
                Todo lo que necesitas para
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200">
                  crecer tu negocio
                </span>
              </h2>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 mt-8">
              <p className="text-lg italic text-white/90 mb-4">
                "Rapi-Credi transformó cómo manejo mi cartera de préstamos. Ahora tengo todo organizado y no pierdo ni un centavo."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  CM
                </div>
                <div>
                  <p className="font-semibold">Carlos Martínez</p>
                  <p className="text-sm text-white/60">Prestamista Independiente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;