
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, this would call an authentication API
      // For this demo, we'll simulate a successful login after a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Store authentication state (in a real app, you would store a token)
      localStorage.setItem("isAuthenticated", "true");
      
      // Redirect to dashboard
      navigate("/");
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Falha ao realizar login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
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
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
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
