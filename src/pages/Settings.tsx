
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInstancias } from "@/hooks/useInstancias";

interface DispatchSettings {
  dispatchesPerHour: number;
  dailyLimit: number;
  interval: number;
  randomInterval: boolean;
}

interface InstanceWithSettings {
  id: string;
  name: string;
  settings: DispatchSettings;
}

export default function Settings() {
  const [instancesWithSettings, setInstancesWithSettings] = useState<InstanceWithSettings[]>([]);
  const [currentInstanceId, setCurrentInstanceId] = useState<string>("");
  const [settings, setSettings] = useState<DispatchSettings>({
    dispatchesPerHour: 60,
    dailyLimit: 1000,
    interval: 1,
    randomInterval: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Buscar instâncias do banco de dados usando o hook personalizado
  const { 
    instancias, 
    isLoading: isLoadingInstancias,
    error: instanciasError
  } = useInstancias();

  // Inicializar as instâncias com configurações padrão
  useEffect(() => {
    if (instancias && instancias.length > 0) {
      const instancesWithDefaultSettings = instancias.map(inst => ({
        id: inst.id,
        name: inst.formatado,
        settings: {
          dispatchesPerHour: 60,
          dailyLimit: 1000,
          interval: 1,
          randomInterval: false,
        }
      }));
      
      setInstancesWithSettings(instancesWithDefaultSettings);
      
      // Definir a primeira instância como selecionada
      if (!currentInstanceId && instancesWithDefaultSettings.length > 0) {
        setCurrentInstanceId(instancesWithDefaultSettings[0].id);
        setSettings(instancesWithDefaultSettings[0].settings);
      }
    }
  }, [instancias, currentInstanceId]);

  // Exibir mensagem de erro se falhar ao carregar instâncias
  useEffect(() => {
    if (instanciasError) {
      toast.error("Erro ao carregar instâncias", {
        description: "Não foi possível carregar os dados de instâncias do servidor."
      });
    }
  }, [instanciasError]);

  const handleInstanceChange = (value: string) => {
    setCurrentInstanceId(value);
    
    // Carregar as configurações da instância selecionada
    const selectedInstance = instancesWithSettings.find(inst => inst.id === value);
    if (selectedInstance) {
      setSettings(selectedInstance.settings);
    }
  };

  const handleInputChange = (key: keyof DispatchSettings, value: number | boolean) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    
    // Atualiza também o objeto de instâncias
    setInstancesWithSettings(instancesWithSettings.map(inst => 
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
      // Encontrar a instância selecionada para obter o texto formatado
      const selectedInstance = instancesWithSettings.find(inst => inst.id === currentInstanceId);
      const instanceText = selectedInstance ? selectedInstance.name : "";

      // Preparar payload para enviar ao webhook
      const payload = {
        instancia: instanceText,
        disparosPorHora: settings.dispatchesPerHour,
        intervaloEntreDisparos: settings.interval,
        limiteDiario: settings.dailyLimit,
        intervaloAleatorio: settings.randomInterval
      };

      // Enviar para o webhook
      const response = await fetch("https://n8n-n8n.wju2x4.easypanel.host/webhook/parametros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Verificar retorno de sucesso
      if (response.ok || data.status === "200") {
        toast.success("Configurações salvas com sucesso!");
      } else {
        // Em caso de erro, exibir mensagem retornada
        toast.error("Erro ao salvar configurações", {
          description: data.message || "Ocorreu um erro ao salvar as configurações."
        });
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações", {
        description: "Não foi possível conectar ao servidor. Verifique sua conexão de internet."
      });
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
            {isLoadingInstancias ? (
              <div className="text-sm text-muted-foreground">Carregando instâncias...</div>
            ) : (
              <Select value={currentInstanceId} onValueChange={handleInstanceChange}>
                <SelectTrigger className="w-full sm:w-72">
                  <SelectValue placeholder="Selecione a instância" />
                </SelectTrigger>
                <SelectContent>
                  {instancesWithSettings.map((instance) => (
                    <SelectItem key={instance.id} value={instance.id}>
                      {instance.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
            disabled={isLoading || isLoadingInstancias || instancesWithSettings.length === 0}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
