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
  * Portas abertas
  * Endereço MAC
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

### Backend (integrado no Next.js)

* Node.js
* API Routes (Next.js)
* Streams (ReadableStream)

### Bibliotecas

* `ping` → verificar se o host está ativo
* `dns` → resolver hostname
* `net` → escanear portas
* `child_process` → obter TTL e MAC (via comandos do sistema)

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

```bash
npm run dev
```

Acesse:

```
http://localhost:3000
```

---

## 🚀 Como usar

1. Defina o IP base
   Ex:

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
* Status (ONLINE/OFFLINE)
* Hostname
* Tipo de dispositivo
* Sistema operacional (estimado)
* Portas abertas (com nome do serviço)
* Endereço MAC

---

## 💾 Exportação

Clique no botão **"Exportar CSV"** para baixar os resultados.

---

## 🧠 Como funciona

* O backend realiza o scan IP por IP
* Os resultados são enviados em tempo real usando **streams**
* O frontend consome os dados progressivamente
* A UI atualiza conforme os dados chegam

---

## ⚠️ Observações

* Funciona melhor em redes locais (LAN)
* Algumas informações (OS e tipo) são estimativas
* O MAC Address depende da tabela ARP do sistema

---

## 📌 Futuras melhorias

* 🔎 Identificação de fabricante via MAC
* 📊 Dashboard com gráficos
* 🌐 Mapeamento visual da rede
* 🔐 Scanner de vulnerabilidades básico
* ⚡ Paralelismo avançado

---

## 👨‍💻 Autor

Desenvolvido por Danilo 🚀
Projeto para estudo, prática e portfólio.


