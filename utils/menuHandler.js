// Welcome Menu - Using interactive text messages
export async function sendWelcomeMenu(message, client) {
  const welcomeMessage = `Indosat Hifi Assistant 💡

Kami berkomitmen untuk melindungi data privasi Pelanggan. Silakan periksa kebijakan privasi serta syarat dan ketentuan berlangganan di: https://hifi.ioh.co.id/privacypolicy

*SILAHKAN PILIH MENU:*

🏠 *MENU UTAMA*
1. 🔹 *HiFi* - Layanan HiFi utama
2. 🔹 *HiFi Air* - Layanan HiFi Air

📋 *ATAU KETIK LANGSUNG:*
• *Pembayaran* - Bayar tagihan
• *Ubah Paket* - Ubah paket langganan  
• *Langganan Baru* - Buat langganan baru
• *Bantuan HiFi* - Bantuan dan dukungan

________________________________
*Ketik **English** untuk bahasa Inggris*`;

  await client.sendMessage(message.from, welcomeMessage);
}

// Main Menu (Service Selection)
export async function sendMainMenu(message, client) {
  const mainMenu = `Indosat Hifi Assistant 💡
*PILIH LAYANAN:*

🏠 *LAYANAN HIFi*
1. 🔹 *HiFi* - Layanan HiFi utama
2. 🔹 *HiFi Air* - Layanan HiFi Air

📋 *MENU CEPAT*
• *Pembayaran* - Bayar tagihan dan pembayaran
• *Ubah Paket* - Ubah paket langganan
• *Langganan Baru* - Buat langganan baru
• *Bantuan HiFi* - Bantuan dan dukungan

Ketik pilihan Anda (contoh: HiFi, Pembayaran, dll)`;

  await client.sendMessage(message.from, mainMenu);
}

// Service Menu (After selecting HiFi/HiFi Air)
export async function sendServiceMenu(message, client) {
  const serviceMenu = `Indosat Hifi Assistant 💡
*MENU LAYANAN HIFi*

📋 *SILAHKAN PILIH:*

1. 💳 *Pembayaran* 
   - Bayar tagihan dan pembayaran
   
2. 🔄 *Ubah Paket* 
   - Ubah paket langganan Anda
   
3. 🆕 *Langganan Baru* 
   - Buat langganan baru
   
4. ❓ *Bantuan HiFi* 
   - Bantuan dan dukungan teknis

*Ketik angka atau nama menu* (contoh: 1 atau Pembayaran)`;

  await client.sendMessage(message.from, serviceMenu);
}

// English Welcome Menu
export async function sendEnglishMenu(message, client) {
  const welcomeMessage = `Indosat Hifi Assistant 💡

We are committed to protecting customer privacy data. Please check the privacy policy and subscription terms at: https://hifi.ioh.co.id/privacypolicy

*PLEASE SELECT MENU:*

🏠 *MAIN MENU*
1. 🔹 *HiFi* - Main HiFi service
2. 🔹 *HiFi Air* - HiFi Air service

📋 *OR TYPE DIRECTLY:*
• *Payment* - Pay bills
• *Change Package* - Change subscription  
• *New Subscription* - Create new subscription
• *HiFi Help* - Help and support

________________________________
*Type **Indonesian** for Indonesian language*`;

  await client.sendMessage(message.from, welcomeMessage);
}

// English Main Menu
export async function sendEnglishMainMenu(message, client) {
  const mainMenu = `Indosat Hifi Assistant 💡
*SELECT SERVICE:*

🏠 *HIFI SERVICES*
1. 🔹 *HiFi* - Main HiFi service
2. 🔹 *HiFi Air* - HiFi Air service

📋 *QUICK MENU*
• *Payment* - Pay bills and payments
• *Change Package* - Change subscription package
• *New Subscription* - Create new subscription
• *HiFi Help* - Help and support

Type your choice (example: HiFi, Payment, etc)`;

  await client.sendMessage(message.from, mainMenu);
}

// English Service Menu
export async function sendEnglishServiceMenu(message, client) {
  const serviceMenu = `Indosat Hifi Assistant 💡
*HIFI SERVICE MENU*

📋 *PLEASE SELECT:*

1. 💳 *Payment* 
   - Pay bills and payments
   
2. 🔄 *Change Package* 
   - Change your subscription package
   
3. 🆕 *New Subscription* 
   - Create new subscription
   
4. ❓ *HiFi Help* 
   - Technical help and support

*Type number or menu name* (example: 1 or Payment)`;

  await client.sendMessage(message.from, serviceMenu);
}

// Simple text response function
export async function sendSimpleResponse(message, client, text) {
  await client.sendMessage(message.from, text);
}
