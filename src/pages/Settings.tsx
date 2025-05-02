
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface DispatchSettings {
  dispatchesPerHour: number;
  dailyLimit: number;
  interval: number;
  randomInterval: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<DispatchSettings>({
    dispatchesPerHour: 60,
    dailyLimit: 1000,
    interval: 1,
    randomInterval: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (key: keyof DispatchSettings, value: number | boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSaveSettings = async () => {
    // Validate settings
    if (settings.dispatchesPerHour <= 0 || settings.dailyLimit <= 0 || settings.interval <= 0) {
      toast.error("Valores devem ser maiores que zero");
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, we'd send to API/webhook
      console.log("Saving settings:", settings);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações de Disparo</h1>
        <p className="text-muted-foreground">
          Definir limites e cadência dos envios.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros de Cadência</CardTitle>
          <CardDescription>
            Configure os limites e intervalos para controlar o ritmo dos disparos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dispatchesPerHour">Disparos por Hora</Label>
              <Input
                id="dispatchesPerHour"
                type="number"
                min={1}
                value={settings.dispatchesPerHour}
                onChange={(e) => handleInputChange("dispatchesPerHour", parseInt(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground">
                Quantidade máxima de mensagens enviadas por hora.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Limite Diário</Label>
              <Input
                id="dailyLimit"
                type="number"
                min={1}
                value={settings.dailyLimit}
                onChange={(e) => handleInputChange("dailyLimit", parseInt(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground">
                Quantidade máxima de mensagens enviadas por dia.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="interval">Intervalo entre Disparos (minutos)</Label>
              <Input
                id="interval"
                type="number"
                min={0.1}
                step={0.1}
                value={settings.interval}
                onChange={(e) => handleInputChange("interval", parseFloat(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground">
                Tempo de espera entre cada mensagem enviada (em minutos).
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="randomInterval">Intervalo Aleatório</Label>
                <Switch
                  id="randomInterval"
                  checked={settings.randomInterval}
                  onCheckedChange={(checked) => handleInputChange("randomInterval", checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Varia o intervalo aleatoriamente para parecer mais natural.
              </p>
            </div>
          </div>

          <Button 
            onClick={handleSaveSettings} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
