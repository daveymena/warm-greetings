import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Shield, TrendingUp, Users, ArrowRight, Sparkles, BarChart3, Wallet } from 'lucide-react';
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
      {/* Left Side - Premium Benefits Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary/90 to-accent" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-pattern-grid opacity-5" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-2">
              <img src="/logo.png" alt="Rapi-Credi" className="h-full w-full object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Rapi-Credi</span>
          </div>

          {/* Main Content */}
          <div className="max-w-lg space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm border border-white/20">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span>Sistema de gestión #1 en préstamos</span>
              </div>
              <h2 className="text-5xl font-bold leading-tight">
                Gestiona tu cartera
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                  como un profesional
                </span>
              </h2>
              <p className="text-xl text-white/70 leading-relaxed">
                Controla préstamos, clientes y cobros desde una sola plataforma intuitiva y segura.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-4">
              {[
                { icon: TrendingUp, title: 'Dashboard en tiempo real', desc: 'Métricas y estadísticas actualizadas al instante' },
                { icon: Users, title: 'Gestión de clientes', desc: 'Base de datos completa con historial crediticio' },
                { icon: Shield, title: 'Seguridad bancaria', desc: 'Encriptación de datos y backups automáticos' },
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="flex items-start gap-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 transition-all hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-white/60">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-8 border-t border-white/10">
            {[
              { value: '10K+', label: 'Préstamos gestionados' },
              { value: '99.9%', label: 'Uptime garantizado' },
              { value: '24/7', label: 'Soporte disponible' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 relative">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Mobile Logo */}
          <div className="flex justify-center lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 p-2.5 shadow-lg">
                <img src="/logo.png" alt="Rapi-Credi" className="h-full w-full object-contain" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">Rapi-Credi</span>
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-0 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-2">
              <CardTitle className="text-3xl font-bold tracking-tight">
                Bienvenido
              </CardTitle>
              <CardDescription className="text-base">
                Ingresa tus credenciales para continuar
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-5">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                    <Link to="#" className="text-sm text-primary hover:underline font-medium">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center space-y-4">
                <p className="text-muted-foreground">
                  ¿No tienes una cuenta?{' '}
                  <Link to="/register" className="font-semibold text-primary hover:underline">
                    Regístrate gratis
                  </Link>
                </p>
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ← Volver al inicio
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Datos protegidos con encriptación SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;