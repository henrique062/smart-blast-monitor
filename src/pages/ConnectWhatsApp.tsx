import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
interface WhatsAppConnectionResponse {
  qrcode: string;
  success?: boolean;
  message?: string;
}
export default function ConnectWhatsApp() {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const validatePhoneNumber = (phone: string): boolean => {
    // Basic validation for phone number (only numbers and common formatting)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };
  const handleConfirm = async () => {
    if (!userName.trim()) {
      toast.error("Por favor, insira o nome do usuário");
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error("Por favor, insira o número do WhatsApp");
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Por favor, insira um número de WhatsApp válido");
      return;
    }
    setIsLoading(true);
    setQrCode(null);
    try {
      const response = await fetch('https://n8n-n8n.wju2x4.easypanel.host/webhook/criar-instancia-evolution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userName.trim(),
          phone: phoneNumber.trim()
        })
      });
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      const data: WhatsAppConnectionResponse = await response.json();
      if (data.qrcode) {
        setQrCode(data.qrcode);
        toast.success("QR Code gerado com sucesso! Escaneie com seu WhatsApp.");
      } else {
        throw new Error(data.message || "QR Code não foi retornado pela API");
      }
    } catch (error) {
      console.error("Erro ao conectar WhatsApp:", error);
      toast.error("Erro ao gerar QR Code. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground text-center">Conectar WhatsApp</h1>
        <p className="text-muted-foreground mt-2 text-center">Configure sua instância do WhatsApp para começar a receber mensagens</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Conexão</CardTitle>
          <CardDescription>
            Preencha as informações abaixo para gerar seu QR Code de conexão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Nome da intância </Label>
            <Input id="userName" type="text" placeholder="Digite o nome do usuário" value={userName} onChange={e => setUserName(e.target.value)} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Número do WhatsApp</Label>
            <Input id="phoneNumber" type="tel" placeholder="Digite o número do WhatsApp (ex: +55 11 99999-9999)" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} disabled={isLoading} />
          </div>

          <Button onClick={handleConfirm} disabled={isLoading} className="w-full">
            {isLoading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando QR Code...
              </> : "Confirmar"}
          </Button>
        </CardContent>
      </Card>

      {qrCode && <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-center">QR Code de Conexão</CardTitle>
            <CardDescription className="text-center">
              Escaneie este QR Code com seu WhatsApp para conectar a instância
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <img src={`data:image/png;base64,${qrCode}`} alt="QR Code para conectar WhatsApp" className="max-w-xs w-full h-auto" />
            </div>
          </CardContent>
        </Card>}
    </div>;
}