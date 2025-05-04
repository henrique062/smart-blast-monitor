
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DispatchSettings {
  dispatchesPerHour: number;
  dailyLimit: number;
  interval: number;
  randomInterval: boolean;
}

interface Instance {
  id: string;
  name: string;
  settings: DispatchSettings;
}

export default function Settings() {
  const [instances, setInstances] = useState<Instance[]>([
    {
      id: "inst1",
      name: "Instância 1",
      settings: {
        dispatchesPerHour: 60,
        dailyLimit: 1000,
        interval: 1,
        randomInterval: false,
      }
    },
    {
      id: "inst2",
      name: "Instância 2",
      settings: {
        dispatchesPerHour: 120,
        dailyLimit: 2000,
        interval: 0.5,
        randomInterval: true,
      }
    },
    {
      id: "inst3",
      name: "Instância 3",
      settings: {
        dispatchesPerHour: 30,
        dailyLimit: 500,
        interval: 2,
        randomInterval: false,
      }
    }
  ]);
  
  const [currentInstanceId, setCurrentInstanceId] = useState<string>("inst1");
  const [settings, setSettings] = useState<DispatchSettings>({
    dispatchesPerHour: 60,
    dailyLimit: 1000,
    interval: 1,
    randomInterval: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Carregar as configurações da instância selecionada
  useEffect(() => {
    const selectedInstance = instances.find(inst => inst.id === currentInstanceId);
    if (selectedInstance) {
      setSettings(selectedInstance.settings);
    }
  }, [currentInstanceId, instances]);

  const handleInstanceChange = (value: string) => {
    setCurrentInstanceId(value);
  };

  const handleInputChange = (key: keyof DispatchSettings, value: number | boolean) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    
    // Atualiza também o objeto de instâncias
    setInstances(instances.map(inst => 
      inst.id === currentInstanceId 
        ? { ...inst, settings: updatedSettings } 
        : inst
    ));
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
      console.log("Saving settings for instance:", currentInstanceId, settings);
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
          <div className="space-y-2">
            <Label htmlFor="instance">Instância</Label>
            <Select value={currentInstanceId} onValueChange={handleInstanceChange}>
              <SelectTrigger className="w-full sm:w-72">
                <SelectValue placeholder="Selecione a instância" />
              </SelectTrigger>
              <SelectContent>
                {instances.map((instance) => (
                  <SelectItem key={instance.id} value={instance.id}>
                    {instance.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Escolha a instância para configurar os parâmetros específicos.
            </p>
          </div>

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
