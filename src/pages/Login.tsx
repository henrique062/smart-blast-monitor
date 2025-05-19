
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, User, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  // Basic email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!email) {
      setErrors(prev => ({ ...prev, email: "Email é obrigatório" }));
      return false;
    } else if (!isValid) {
      setErrors(prev => ({ ...prev, email: "Email inválido" }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, email: "" }));
    return true;
  };

  // Password validation - just checking if it's not empty for now
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Senha é obrigatória" }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, password: "" }));
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs before submission
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      // Call the login method from useAuth hook
      await login(email, password);
    } catch (error) {
      // Error handling is done inside the login function
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with logo and background color */}
      <div 
        className="hidden md:flex md:w-1/2 bg-[#071E25] flex-col items-center justify-center p-8"
      >
        <div className="flex flex-col items-center justify-center w-full max-w-md space-y-6">
          <img 
            src="/lovable-uploads/35a93cc0-b163-4b3b-a17a-35268a2640a8.png" 
            alt="ANTECIPA BRASIL" 
            className="max-w-[320px] w-full"
          />
        </div>
      </div>
      
      {/* Right side with login form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Monitor de Disparos</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {/* Mobile logo (visible only on small screens) */}
              <div className="flex md:hidden justify-center mb-4">
                <img 
                  src="/lovable-uploads/35a93cc0-b163-4b3b-a17a-35268a2640a8.png" 
                  alt="ANTECIPA BRASIL" 
                  className="max-w-[200px] w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) validateEmail(e.target.value);
                    }}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    onBlur={() => validateEmail(email)}
                    required
                    autoComplete="email"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) validatePassword(e.target.value);
                    }}
                    className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                    onBlur={() => validatePassword(password)}
                    required
                    autoComplete="current-password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
