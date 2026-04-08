# 🌐 Scanner de Rede Web

Uma aplicação web moderna para escaneamento de rede local, capaz de identificar dispositivos ativos, portas abertas, sistema operacional, tipo de dispositivo e endereço MAC — tudo em tempo real.

---

## ✨ Funcionalidades

* ⚡ Escaneamento em tempo real (streaming)
* 📊 Barra de progresso dinâmica
* 🌐 Suporte a múltiplos formatos de IP:

  * IP único: `10`
  * Range: `1-20`
  * Múltiplos: `5,10,15-30`
* 🔍 Detecção de:

  * Status (ONLINE/OFFLINE)
  * Hostname
  * Sistema operacional (estimado)
  * Tipo de dispositivo
  * Portas abertas (com nome do serviço)
  * Endereço MAC
  * Tempo de resposta (latência)
* 🎯 Destaque visual de portas importantes (HTTP, SSH, RDP, etc)
* 📁 Exportação de resultados em CSV
* 🎨 Interface moderna com Tailwind CSS

---

## 🛠️ Tecnologias utilizadas

### Frontend

* Next.js 16 (App Router)
* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express
* Streams (ReadableStream)

### Bibliotecas

* `ping` → verificar se o host está ativo
* `dns` → resolver hostname
* `net` → escanear portas
* `child_process` → obter TTL e MAC

---

## 📦 Instalação

Clone o projeto:

```bash
git clone https://github.com/DaniloPy-coder/Scanner_rede.git
cd scanner-redes
```

Instale as dependências:

```bash
npm install
```

---

## ▶️ Como rodar

### 1️⃣ Backend (Express)

```bash
cd backend
npm install
npm run dev
```

Servidor rodando em:

```
http://localhost:3001
```

---

### 2️⃣ Frontend (Next.js)

```bash
npm run dev
```

Acesse:

```
http://localhost:3000
```

---

## 🚀 Como usar

1. Defina o IP base:

```
192.168.1
```

2. Defina os IPs:

| Tipo      | Exemplo      |
| --------- | ------------ |
| Único     | `10`         |
| Range     | `1-20`       |
| Múltiplos | `5,10,15-30` |

3. Defina as portas:

```
22,80,443,3389
```

4. Clique em **"Iniciar Scan"**

---

## 📊 Resultado

A aplicação exibirá em tempo real:

* IP
* Status
* Hostname
* Tipo de dispositivo
* Sistema operacional (estimado)
* Tempo de resposta
* Portas abertas (com nome do serviço)
* Endereço MAC

---

## 💾 Exportação

Clique em **"Exportar CSV"** para baixar os resultados.

---

## 🧠 Como funciona

* O backend realiza o scan IP por IP
* Usa concorrência controlada para performance
* Os resultados são enviados progressivamente
* O frontend atualiza a interface em tempo real

---

## ⚠️ Observações importantes

* ⚠️ O scanner funciona apenas em redes locais (LAN)
* ⚠️ Não funciona em ambientes serverless (ex: Vercel)
* ⚠️ O backend precisa estar rodando localmente
* Algumas informações são estimativas (OS e tipo)
* O MAC Address depende da tabela ARP do sistema

---

## 🚀 Deploy

O frontend pode ser hospedado na Vercel.

⚠️ O backend deve rodar localmente ou em um servidor (VPS), pois utiliza recursos de rede não suportados em ambientes serverless.

---

## 📌 Futuras melhorias

* 📊 Dashboard com gráficos
* 🌐 Mapeamento visual da rede
* 🔐 Scanner de vulnerabilidades básico
* ⚡ WebSockets para tempo real avançado

---

## 👨‍💻 Autor

Desenvolvido por Danilo 🚀
Projeto focado em aprendizado, redes e desenvolvimento full stack.
