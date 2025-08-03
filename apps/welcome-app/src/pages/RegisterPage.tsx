import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RegisterDataSchema } from '@types/user.zod';

// Ajout du champ confirmPassword à la validation Zod
const RegisterSchema = RegisterDataSchema.extend({
  confirmPassword: z.string().min(8, 'La confirmation doit contenir au moins 8 caractères'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      role: 'acheteur',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const user = await registerUser({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        role: data.role,
      });
      // user.role may be returned by registerUser, otherwise fetch from storage or API
      const role = user?.role || data.role || localStorage.getItem('user_role');
      if (role) {
        authService.redirectToApp(role);
      } else {
        window.location.href = '/';
      }
    } catch (err: unknown) {
      const error = err as Error;
      // L'erreur sera affichée par le contexte Auth ou via toast
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            {errors.root && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {errors.root.message}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                {...register('full_name')}
                placeholder="John Doe"
                disabled={isSubmitting}
                aria-invalid={!!errors.full_name}
                required
              />
              {errors.full_name && (
                <span className="text-xs text-red-500">{errors.full_name.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Je suis</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="acheteur"
                    value="acheteur"
                    {...register('role')}
                    checked={watch('role') === 'acheteur'}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="acheteur" className="cursor-pointer">Acheteur</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="vendeur"
                    value="vendeur"
                    {...register('role')}
                    checked={watch('role') === 'vendeur'}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="vendeur" className="cursor-pointer">Vendeur</Label>
                </div>
              </div>
              {errors.role && (
                <span className="text-xs text-red-500">{errors.role.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="m@example.com"
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                required
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                disabled={isSubmitting}
                aria-invalid={!!errors.password}
                required
              />
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                disabled={isSubmitting}
                aria-invalid={!!errors.confirmPassword}
                required
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Créer mon compte
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
