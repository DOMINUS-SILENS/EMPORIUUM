import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { authService } from '@services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Veuillez entrer un email valide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setMessage('');
    try {
      // TODO: implémenter login sur authService centralisé
      // const authResponse = await authService.login(data.email, data.password);
      setMessage('Connexion réussie!');
      setTimeout(() => {
        // authService.redirectToApp(authResponse.user.role);
      }, 1000);
    } catch (error) {
      setMessage('Échec de la connexion. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Connexion
          </CardTitle>
          <CardDescription className="text-gray-600">
            Connectez-vous à votre compte pour accéder à votre espace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="pl-10 bg-white/70 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                  placeholder="votre@email.com"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                  required
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="pl-10 bg-white/70 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.password}
                  required
                />
              </div>
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password.message}</span>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              variant="premium"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
            {message && (
              <p className={`text-sm text-center font-medium ${
                message.includes('réussie') ? 'text-green-600' : 'text-red-600'
              }`}>
                {message}
              </p>
            )}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Pas encore de compte?{' '}
                <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors">
                  S'inscrire
                </Link>
              </p>

            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;