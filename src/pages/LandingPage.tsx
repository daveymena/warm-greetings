import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Smartphone,
  TrendingUp,
  Shield,
  Zap,
  Users,
  BarChart3,
  Check,
  ArrowRight,
  DollarSign,
  Clock,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      icon: Smartphone,
      title: "App Móvil Profesional",
      description: "Gestiona tu negocio desde cualquier lugar con nuestra app diseñada para prestamistas profesionales"
    },
    {
      icon: TrendingUp,
      title: "Control Total de Cartera",
      description: "Visualiza en tiempo real el estado de todos tus préstamos y pagos pendientes"
    },
    {
      icon: Shield,
      title: "Seguro y Confiable",
      description: "Tus datos y los de tus clientes están protegidos con encriptación de nivel bancario"
    },
    {
      icon: Zap,
      title: "Rápido y Eficiente",
      description: "Crea préstamos en segundos y registra pagos al instante"
    },
    {
      icon: Users,
      title: "Gestión de Clientes",
      description: "Mantén un registro completo de tus clientes y su historial crediticio"
    },
    {
      icon: BarChart3,
      title: "Reportes y Estadísticas",
      description: "Toma decisiones informadas con reportes detallados de tu negocio"
    }
  ];

  const benefits = [
    "Interfaz intuitiva y fácil de usar",
    "Cálculo automático de intereses",
    "Notificaciones de pagos vencidos",
    "Historial completo de transacciones",
    "Respaldo automático en la nube",
    "Soporte técnico dedicado"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white p-1.5 shadow-md border border-primary/10">
              <img src="/logo.png" alt="Rapi-Credi" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">Rapi-Credi</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-primary border-0 shadow-lg shadow-primary/30">
                Comenzar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Zap className="inline h-4 w-4 mr-2" />
              La herramienta #1 para prestamistas profesionales
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Gestiona tu negocio de{' '}
              <span className="text-primary">
                préstamos
              </span>{' '}
              como un profesional
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Rapi-Credi es la plataforma completa para prestamistas que quieren llevar su negocio al siguiente nivel.
              Control total, reportes en tiempo real y una experiencia móvil excepcional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-primary border-0 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all text-lg px-8 py-6 group">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Ver Demo
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">Simple</div>
                <div className="text-sm text-muted-foreground">Fácil de usar</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">Seguro</div>
                <div className="text-sm text-muted-foreground">Datos encriptados</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">Móvil</div>
                <div className="text-sm text-muted-foreground">Acceso 24/7</div>
              </div>
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <img
              src="/assets/real-screens/dashboard.png"
              alt="Rapi-Credi App Dashboard"
              className="relative z-10 rounded-[3rem] shadow-2xl border-8 border-white dark:border-gray-800"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-[3rem] my-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Todo lo que necesitas para{' '}
            <span className="text-primary">gestionar tu negocio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Herramientas profesionales diseñadas específicamente para prestamistas que buscan eficiencia y control
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="card-hover rounded-[1.5rem] border-none bg-white/80 dark:bg-card/50 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg shadow-primary/20">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* App Screenshots Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Una app diseñada para{' '}
            <span className="text-primary">prestamistas profesionales</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interfaz moderna y colorida que hace que gestionar préstamos sea una experiencia agradable
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 text-center">
            <div className="relative mx-auto w-64">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-2xl rounded-full" />
              <img
                src="/assets/real-screens/dashboard.png"
                alt="Dashboard"
                className="relative z-10 rounded-[2rem] shadow-2xl border-4 border-white"
              />
            </div>
            <h3 className="text-xl font-bold">Dashboard Intuitivo</h3>
            <p className="text-muted-foreground">Visualiza todo tu negocio de un vistazo</p>
          </div>
          <div className="space-y-4 text-center">
            <div className="relative mx-auto w-64">
              <div className="absolute inset-0 bg-gradient-success opacity-20 blur-2xl rounded-full" />
              <img
                src="/assets/real-screens/clients.png"
                alt="Clientes"
                className="relative z-10 rounded-[2rem] shadow-2xl border-4 border-white"
              />
            </div>
            <h3 className="text-xl font-bold">Gestión de Clientes</h3>
            <p className="text-muted-foreground">Organiza y controla tu cartera de clientes</p>
          </div>
          <div className="space-y-4 text-center">
            <div className="relative mx-auto w-64">
              <div className="absolute inset-0 bg-gradient-warning opacity-20 blur-2xl rounded-full" />
              <img
                src="/assets/real-screens/loans.png"
                alt="Préstamos"
                className="relative z-10 rounded-[2rem] shadow-2xl border-4 border-white"
              />
            </div>
            <h3 className="text-xl font-bold">Control de Préstamos</h3>
            <p className="text-muted-foreground">Gestiona cada préstamo con precisión</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-success opacity-20 blur-3xl rounded-full" />
            <img
              src="/assets/real-screens/collections.png"
              alt="Rapi-Credi Collections"
              className="relative z-10 rounded-[3rem] shadow-2xl border-8 border-white dark:border-gray-800"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              ¿Por qué elegir{' '}
              <span className="text-primary">Rapi-Credi</span>?
            </h2>
            <p className="text-xl text-muted-foreground">
              Diseñado específicamente para prestamistas que quieren profesionalizar su negocio y aumentar su rentabilidad
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-success">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary border-0 shadow-xl shadow-primary/30 text-lg px-8 py-6 group">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="rounded-[3rem] border-none bg-gradient-primary text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <CardContent className="relative z-10 p-12 md:p-20 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              ¿Listo para llevar tu negocio al siguiente nivel?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Únete a cientos de prestamistas que ya están transformando su negocio con Rapi-Credi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 group">
                  Comenzar Ahora - Es Gratis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 pt-4 text-white/80">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span>Configuración en 5 minutos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white p-1.5 shadow-md border border-primary/10">
                  <img src="/logo.png" alt="Rapi-Credi" className="h-full w-full object-contain" />
                </div>
                <span className="text-xl font-bold tracking-tight">Rapi-Credi</span>
              </div>
              <p className="text-sm text-muted-foreground">
                La plataforma profesional para gestionar tu negocio de préstamos
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Producto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Seguridad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Rapi-Credi. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;