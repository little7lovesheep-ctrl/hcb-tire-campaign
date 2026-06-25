const stores = {
  西安: {
    name: "西安高陵货车轮胎服务点",
    address: "西安市高陵区·德邦物流（西安高陵区泾河工业园经营分部）",
  },
  义乌: {
    name: "义乌货车轮胎服务点",
    address: "浙江省金华市义乌市四季路1000号京东亚洲一号园区4号库2楼10号门",
  },
  杭州钱塘: {
    name: "杭州钱塘货车轮胎服务点",
    address: "杭州市钱塘区杭州下沙场地",
  },
  长春宽城: {
    name: "长春宽城货车轮胎服务点",
    address: "长春市宽城区·中吉通仓储物流园德邦",
  },
  山东潍坊: {
    name: "山东潍坊货车轮胎服务点",
    address: "潍坊市·中国邮政潍坊邮件处理中心（殷大路店）",
  },
  其他城市: {
    name: "其他城市正在陆续开放，敬请期待！",
    address: "当前活动先开放西安、义乌、杭州钱塘、长春宽城、山东潍坊，其他城市正在陆续开放。",
    comingSoon: true,
  },
};

const productName = "玲珑轮胎 四线花纹 12R22.5";
const productPrice = 999;
const couponValue = 50;

const state = {
  quantity: 2,
  arrival: "近3天",
  city: "西安",
};

function selectExclusive(buttons, selectedButton) {
  buttons.forEach((button) => {
    const active = button === selectedButton;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

const arrivalButtons = [...document.querySelectorAll("[data-arrival]")];
arrivalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectExclusive(arrivalButtons, button);
    state.arrival = button.dataset.arrival;
  });
});

document.querySelector("#decrease").addEventListener("click", () => {
  state.quantity = Math.max(1, state.quantity - 1);
  updateTotal();
});

document.querySelector("#increase").addEventListener("click", () => {
  state.quantity = Math.min(12, state.quantity + 1);
  updateTotal();
});

function getFinalTotal() {
  return Math.max(0, productPrice * state.quantity - couponValue);
}

function formatMoney(value) {
  return `¥${value.toLocaleString("zh-CN")}`;
}

function updateTotal() {
  const goodsTotal = productPrice * state.quantity;
  const finalTotal = getFinalTotal();
  document.querySelector("#quantity").textContent = state.quantity;
  document.querySelector("#summaryProduct").textContent = `${productName} × ${state.quantity}条`;
  document.querySelector("#goodsTotal").textContent = formatMoney(goodsTotal);
  document.querySelector("#finalTotal").textContent = formatMoney(finalTotal);
  document.querySelector("#modalTotal").textContent = formatMoney(finalTotal);
}

const storeSelect = document.querySelector("#storeSelect");
storeSelect.addEventListener("change", () => {
  state.city = storeSelect.value;
  document.querySelector("#storeAddress").textContent = stores[state.city].address;
  if (stores[state.city].comingSoon) {
    showToast("其他城市正在陆续开放，敬请期待");
  }
});

const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

const paymentModal = document.querySelector("#paymentModal");

function openModal() {
  paymentModal.classList.add("open");
  paymentModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  paymentModal.classList.remove("open");
  paymentModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelector("#closeModal").addEventListener("click", closeModal);
paymentModal.addEventListener("click", (event) => {
  if (event.target === paymentModal) closeModal();
});

document.querySelector("#bookingForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const phoneInput = document.querySelector("#driverPhone");
  const phone = phoneInput.value.trim();

  if (!/^1\d{10}$/.test(phone)) {
    showToast("请输入正确的11位手机号");
    phoneInput.focus();
    return;
  }

  if (stores[state.city].comingSoon) {
    showToast("请先选择已开放的安装门店");
    storeSelect.focus();
    return;
  }

  const details = [
    ["轮胎", `${productName} × ${state.quantity}条`],
    ["活动价", `折扣后999元/条`],
    ["平台券", `货车宝支持50元抵扣`],
    ["旧胎回收", "需旧胎回收"],
    ["联系电话", phone],
    ["预计到店", state.arrival],
    ["预约门店", stores[state.city].name],
  ];

  document.querySelector("#bookingResult").innerHTML = details
    .map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  updateTotal();
  openModal();
});

document.querySelector("#confirmPay").addEventListener("click", () => {
  closeModal();
  showToast("演示支付成功，门店将电话确认到店时间");
});

updateTotal();
