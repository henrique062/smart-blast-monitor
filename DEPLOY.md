# Instruções para Deploy no EasyPanel

Este documento contém instruções para implantar o aplicativo no EasyPanel usando Docker.

## Pré-requisitos

- EasyPanel instalado no servidor
- Acesso à interface do EasyPanel
- Git instalado no servidor (para clonar o repositório)

## Passos para Implantação

1. No EasyPanel, acesse a seção "Projetos" e clique em "Criar Projeto"

2. Escolha a opção "Importar do GitHub" ou "Upload Manual", dependendo de como você deseja importar o código

3. Se estiver usando o método de importação do GitHub:
   - Conecte sua conta do GitHub
   - Selecione o repositório
   - Configure as permissões necessárias

4. Se estiver usando o método de upload manual:
   - Faça o upload dos arquivos do projeto, incluindo o Dockerfile e docker-compose.yml

5. Em "Configurações de Implantação":
   - Certifique-se de que a porta 80 esteja mapeada corretamente
   - Configure o domínio ou subdomínio desejado

6. Clique em "Implantar" e aguarde a conclusão da construção e implantação

## Observações Importantes

- O EasyPanel deve detectar automaticamente o arquivo docker-compose.yml e usar suas configurações
- O Dockerfile está configurado para construir o aplicativo React e servi-lo usando Nginx
- A configuração do Nginx está preparada para aplicativos de página única (SPA), redirecionando todas as rotas para o index.html

## Solução de Problemas

Se encontrar problemas durante a implantação:

1. Verifique os logs de construção e implantação no EasyPanel
2. Confirme se todas as variáveis de ambiente necessárias estão configuradas
3. Verifique se as portas estão mapeadas corretamente
4. Certifique-se de que o EasyPanel tem permissões suficientes para construir e executar o contêiner Docker 