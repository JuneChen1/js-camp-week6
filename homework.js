// ========================================
// 第六週作業：電商 API 資料串接練習
// 執行方式：node homework.js
// 環境需求：Node.js 18+（內建 fetch）
// ========================================

// 載入環境變數
require("dotenv").config({ path: ".env" });

// API 設定（從 .env 讀取）
const API_PATH = process.env.API_PATH;
const BASE_URL = "https://livejs-api.hexschool.io";
const ADMIN_TOKEN = process.env.API_KEY;

// ========================================
// 任務一：基礎 fetch 練習
// ========================================

/**
 * 1. 取得產品列表
 * 使用 fetch 發送 GET 請求
 * @returns {Promise<Array>} - 回傳 products 陣列
 */
async function getProducts() {
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
	const data = await response.json();
	return data.products
}

/**
 * 2. 取得購物車列表
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function getCart() {
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`);
	const data = await response.json();
	return {
		carts: data.carts,
		total: data.total,
		finalTotal: data.finalTotal
	}
}

/**
 * 3. 錯誤處理：當 API 回傳錯誤時，回傳錯誤訊息
 * @returns {Promise<Object>} - 回傳 { success: boolean, data?: [...], error?: string }
 */
async function getProductsSafe() {
	try {
		const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message);
		}
		
		return { success: true, data: data.products };
	} catch (error) {
		return { success: false, error: error.message };
	}
}

// ========================================
// 任務二：POST 請求 - 購物車操作
// ========================================

/**
 * 1. 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function addToCart(productId, quantity) {
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ data: { productId, quantity } })
		});
	return await response.json();
}

/**
 * 2. 編輯購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function updateCartItem(cartId, quantity) {
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`,
		{
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ data: { id: cartId, quantity } })
		});

	return await response.json();
}

/**
 * 3. 刪除購物車特定商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function removeCartItem(cartId) {
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`, { method: 'DELETE' });

	return await response.json();
}

/**
 * 4. 清空購物車
 * @returns {Promise<Object>} - 回傳清空後的購物車資料
 */
async function clearCart() {
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, { method: 'DELETE' });

	return await response.json();
}

// ========================================
// HTTP 知識測驗 (額外練習)
// ========================================

/*
請回答以下問題（可以寫在這裡或另外繳交）：

1. HTTP 狀態碼的分類（1xx, 2xx, 3xx, 4xx, 5xx 各代表什麼）
   答：
	 1xx(資訊回應)：代表請求已接收，繼續處理。例如"100 Continue"代表應客戶端應繼續傳送請求，如果請求已完成，則忽略此回應。
	 2xx(成功回應)：請求已成功接收、理解與接受。例如"200 OK"代表請求成功。
	 3xx(重新導向)：需要進一步的操作以完成請求。例如"302 Found"代表需執行臨時重新導向，但客戶端在以後的請求依然需使用相同的網址。
	 4xx(用戶端錯誤)：請求包含錯誤語法，或是無法完成。例如"404 Not Found"代表伺服器找不到請求的資源。
	 5xx(伺服器端錯誤)：伺服器未能完成有效的請求。例如"500 Internal Server Error"代表伺服器遇到意料之外的狀況。

2. GET、POST、PATCH、PUT、DELETE 的差異
   答：
	 GET(讀取)：請求特定資源。
	 POST(新增)：建立新的資源。
	 PATCH(部分更新)：修改現有資源的部分欄位。
	 PUT(完整替換)：完整替換資源，如果資源不存在，則新增。
	 DELETE(刪除)：刪除指定的資源。

3. 什麼是 RESTful API？
   答：
	 應用程式介面 (API) 讓應用程式之間能相互溝通、交換資料，而 REST 是一種 API 的架構風格，使用 RESTful API 進行標準化，可以降低開發者之間的溝通成本。

	 核心概念：
	 1. 以資源為中心：將網路上的所有內容視為資源，並為每個資源分配一個唯一的網址（URL）。
	 2. 利用 HTTP 動詞：直接使用 HTTP 通訊協定的原生動作來操作資源。
	 3. 無狀態性：伺服器不會儲存客戶端的任何資訊，每次發請求時，都必須包含完成該操作所需的所有資料(Token)，有助於系統的擴展與穩定性。
	 4. 資料格式：使用 JSON 格式來傳輸資料。



*/

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
	API_PATH,
	BASE_URL,
	ADMIN_TOKEN,
	getProducts,
	getCart,
	getProductsSafe,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
};

// ========================================
// 直接執行測試
// ========================================
if (require.main === module) {
	async function runTests() {
		console.log("=== 第六週作業測試 ===\n");
		console.log("API_PATH:", API_PATH);
		console.log("");

		if (!API_PATH) {
			console.log("請先在 .env 檔案中設定 API_PATH！");
			return;
		}

		// 任務一測試
		console.log("--- 任務一：基礎 fetch ---");
		try {
			const products = await getProducts();
			console.log(
				"getProducts:",
				products ? `成功取得 ${products.length} 筆產品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getProducts 錯誤:", error.message);
		}

		try {
			const cart = await getCart();
			console.log(
				"getCart:",
				cart ? `購物車有 ${cart.carts?.length || 0} 筆商品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getCart 錯誤:", error.message);
		}

		try {
			const result = await getProductsSafe();
			console.log(
				"getProductsSafe:",
				result?.success ? "成功" : result?.error || "回傳 undefined",
			);
		} catch (error) {
			console.log("getProductsSafe 錯誤:", error.message);
		}

		console.log("\n=== 測試結束 ===");
		console.log("\n提示：執行 node test.js 進行完整驗證");
	}

	runTests();
}
