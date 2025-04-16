/**
 * 信用卡号码生成器
 * 支持生成Visa、万事达卡、美国运通、Discover、JCB和其他卡类型的号码
 */

// DOM元素
document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.querySelector('.btn-generate');
  const copyBtn = document.querySelector('.btn-copy');
  const copyCardBtn = document.querySelector('.btn-copy-card');
  const flipBtn = document.querySelector('.btn-flip');
  const cardResult = document.querySelector('.card-number span');
  const cardNumberDisplay = document.querySelector('.card-number-display');
  const cardExpiryDate = document.querySelector('.card-expiry-date');
  const cardExpiryDisplay = document.querySelector('.card-expiry-display');
  const cardCvvValue = document.querySelector('.card-cvv-value');
  const cardCvvDisplay = document.querySelector('.card-cvv-display');
  const cardFlip = document.querySelector('.card-flip');
  const cardTypeRadios = document.querySelectorAll('input[name="cardType"]');
  const creditCard = document.querySelector('.credit-card');
  const creditCardBack = document.querySelector('.card-back .credit-card');
  const cardBrandLogo = document.querySelector('.card-brand-logo');
  
  // 当前卡数据
  let currentCardData = {
    number: '',
    expiry: '',
    cvv: ''
  };
  
  // 卡品牌logo映射
  const cardLogos = {
    visa: 'images/visa.svg',
    mastercard: 'images/mastercard.svg',
    amex: 'images/amex.svg',
    discover: 'images/discover.svg',
    jcb: 'images/jcb.svg'
  };
  
  // 绑定事件监听器
  generateBtn.addEventListener('click', generateCardNumber);
  copyBtn.addEventListener('click', copyToClipboard); // 复制所有卡信息按钮
  copyCardBtn.addEventListener('click', copyCardNumber); // 仅复制卡号按钮
  flipBtn.addEventListener('click', flipCard);
  
  // 为每个卡类型选项添加点击事件监听器
  cardTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      // 更新所选卡的视觉样式
      updateCardSelection(radio.value);
      // 更新虚拟信用卡样式
      updateCreditCardStyle(radio.value);
    });
  });
  
  // 初始化选择效果和虚拟信用卡样式
  updateCardSelection('visa');
  updateCreditCardStyle('visa');
  
  /**
   * 翻转卡片
   */
  function flipCard() {
    cardFlip.classList.toggle('flipped');
  }
  
  /**
   * 更新卡类型选择的视觉效果
   * @param {string} selectedType - 当前选择的卡类型值
   */
  function updateCardSelection(selectedType) {
    // 移除所有卡的选中样式
    document.querySelectorAll('.card-type-form label div').forEach(card => {
      card.classList.remove('selected');
    });
    
    // 为当前选中的卡添加样式
    const selectedCard = document.querySelector(`input[value="${selectedType}"]`).closest('label').querySelector('div');
    selectedCard.classList.add('selected');
  }
  
  /**
   * 更新虚拟信用卡样式
   * @param {string} cardType - 卡类型
   */
  function updateCreditCardStyle(cardType) {
    // 移除所有卡类型类名
    creditCard.classList.remove('visa', 'mastercard', 'amex', 'discover', 'jcb');
    creditCardBack.classList.remove('visa', 'mastercard', 'amex', 'discover', 'jcb');
    
    // 添加对应的卡类型类名
    creditCard.classList.add(cardType);
    creditCardBack.classList.add(cardType);
    
    // 更新品牌logo
    cardBrandLogo.src = cardLogos[cardType];
    cardBrandLogo.alt = cardType.charAt(0).toUpperCase() + cardType.slice(1) + ' Logo';
  }
  
  /**
   * 生成信用卡号
   */
  function generateCardNumber() {
    // 获取当前选择的卡类型
    const selectedType = document.querySelector('input[name="cardType"]:checked').value;
    let cardNumber = '';
    
    // 基于卡类型生成卡号
    switch (selectedType) {
      case 'visa':
        cardNumber = generateVisaNumber();
        break;
      case 'mastercard':
        cardNumber = generateMastercardNumber();
        break;
      case 'amex':
        cardNumber = generateAmexNumber();
        break;
      case 'discover':
        cardNumber = generateDiscoverNumber();
        break;
      case 'jcb':
        cardNumber = generateJCBNumber();
        break;
      default:
        cardNumber = generateVisaNumber();
    }
    
    // 格式化卡号以便显示
    const formattedCardNumber = formatCardNumber(cardNumber, selectedType);
    cardResult.textContent = formattedCardNumber;
    cardNumberDisplay.textContent = formattedCardNumber;
    
    // 存储当前卡号
    currentCardData.number = cardNumber;
    
    // 添加复制成功动画效果
    cardResult.classList.add('select-all');
    
    // 更新虚拟信用卡样式
    updateCreditCardStyle(selectedType);
    
    // 生成并显示有效期
    const expiry = generateExpiry();
    cardExpiryDate.textContent = expiry;
    cardExpiryDisplay.textContent = expiry;
    currentCardData.expiry = expiry;
    
    // 生成并显示CVV
    const cvv = generateCVV(selectedType);
    cardCvvValue.textContent = cvv;
    cardCvvDisplay.textContent = cvv;
    currentCardData.cvv = cvv;
    
    // 添加生成效果
    animateCardGeneration();
  }
  
  /**
   * 添加卡生成动画效果
   */
  function animateCardGeneration() {
    // 为生成按钮添加点击效果
    generateBtn.classList.add('scale-95');
    setTimeout(() => {
      generateBtn.classList.remove('scale-95');
    }, 200);
    
    // 为卡片添加生成效果
    const cardFront = document.querySelector('.card-front .credit-card');
    cardFront.classList.add('shadow-lg');
    cardFront.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      cardFront.style.transform = 'translateY(0)';
    }, 500);
  }
  
  /**
   * 生成CVV安全码
   * @param {string} cardType - 卡类型
   * @return {string} - CVV安全码
   */
  function generateCVV(cardType) {
    // 对于AMEX，CVV是4位数
    const length = cardType === 'amex' ? 4 : 3;
    let cvv = '';
    
    // 生成随机CVV
    for (let i = 0; i < length; i++) {
      cvv += Math.floor(Math.random() * 10);
    }
    
    return cvv;
  }
  
  /**
   * 生成有效期
   * @return {string} - 格式化的有效期(MM/YY)
   */
  function generateExpiry() {
    // 获取当前年份的后两位数字
    const currentYear = new Date().getFullYear() % 100;
    
    // 生成一个1-12之间的随机月份
    const month = Math.floor(Math.random() * 12) + 1;
    // 生成一个当前年份后3-7年的随机有效期
    const year = currentYear + 3 + Math.floor(Math.random() * 5);
    
    // 格式化月份确保是两位数
    const formattedMonth = month.toString().padStart(2, '0');
    
    return `${formattedMonth}/${year}`;
  }
  
  /**
   * 生成Visa卡号(以4开头，16位数字)
   */
  function generateVisaNumber() {
    // 以4开头
    let cardNumber = '4';
    
    // 生成剩余的14位数字
    for (let i = 0; i < 14; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }
    
    // 计算并添加校验位
    const checkDigit = generateCheckDigit(cardNumber);
    return cardNumber + checkDigit;
  }
  
  /**
   * 生成万事达卡号(以51-55开头，或2221-2720(新BIN范围)，16位数字)
   */
  function generateMastercardNumber() {
    // 以51-55开头，或2221-2720(新BIN范围)
    let cardNumber;
    
    // 随机决定使用哪个BIN范围
    if (Math.random() > 0.5) {
      // 使用传统的51-55范围
      const prefixes = ['51', '52', '53', '54', '55'];
      cardNumber = prefixes[Math.floor(Math.random() * prefixes.length)];
      
      // 生成剩余的13位数字
      for (let i = 0; i < 13; i++) {
        cardNumber += Math.floor(Math.random() * 10);
      }
    } else {
      // 使用新的2221-2720范围
      // 生成一个介于2221和2720之间的随机数
      const prefix = 2221 + Math.floor(Math.random() * 500);
      cardNumber = prefix.toString();
      
      // 生成剩余的12位数字
      for (let i = 0; i < 12; i++) {
        cardNumber += Math.floor(Math.random() * 10);
      }
    }
    
    // 计算并添加校验位
    const checkDigit = generateCheckDigit(cardNumber);
    return cardNumber + checkDigit;
  }
  
  /**
   * 生成美国运通卡号(以34或37开头，15位数字)
   */
  function generateAmexNumber() {
    // 以34或37开头
    const prefixes = ['34', '37'];
    let cardNumber = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    // 生成剩余的12位数字
    for (let i = 0; i < 12; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }
    
    // 计算并添加校验位
    const checkDigit = generateCheckDigit(cardNumber);
    return cardNumber + checkDigit;
  }
  
  /**
   * 生成Discover卡号(以6011、644-649或65开头，16位数字)
   */
  function generateDiscoverNumber() {
    let cardNumber;
    const rand = Math.random();
    
    if (rand < 0.4) {
      // 6011前缀
      cardNumber = '6011';
      // 生成剩余的11位数字
      for (let i = 0; i < 11; i++) {
        cardNumber += Math.floor(Math.random() * 10);
      }
    } else if (rand < 0.8) {
      // 644-649前缀
      cardNumber = '64' + (4 + Math.floor(Math.random() * 6));
      // 生成剩余的13位数字
      for (let i = 0; i < 13; i++) {
        cardNumber += Math.floor(Math.random() * 10);
      }
    } else {
      // 65前缀
      cardNumber = '65';
      // 生成剩余的13位数字
      for (let i = 0; i < 13; i++) {
        cardNumber += Math.floor(Math.random() * 10);
      }
    }
    
    // 计算并添加校验位
    const checkDigit = generateCheckDigit(cardNumber);
    return cardNumber + checkDigit;
  }
  
  /**
   * 生成JCB卡号(以3528-3589开头，16位数字)
   */
  function generateJCBNumber() {
    // JCB卡以3528-3589开头
    // 生成一个3528和3589之间的随机数
    const prefix = 3528 + Math.floor(Math.random() * 62);
    let cardNumber = prefix.toString();
    
    // 生成剩余的12位数字(共16位减去4位前缀)
    for (let i = 0; i < 11; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }
    
    // 计算并添加校验位
    const checkDigit = generateCheckDigit(cardNumber);
    return cardNumber + checkDigit;
  }
  
  /**
   * 使用Luhn算法生成校验位
   * @param {string} partialCardNumber - 不含校验位的卡号
   * @return {string} - 校验位
   */
  function generateCheckDigit(partialCardNumber) {
    // 转换为数组并反转顺序
    const digits = partialCardNumber.split('').reverse().map(Number);
    
    let sum = 0;
    
    // 应用Luhn算法
    for (let i = 0; i < digits.length; i++) {
      if (i % 2 === 1) {
        // 将偶数位置的数字乘以2
        let doubled = digits[i] * 2;
        // 如果结果大于9，减去9
        if (doubled > 9) {
          doubled -= 9;
        }
        sum += doubled;
      } else {
        // 直接添加奇数位置的数字
        sum += digits[i];
      }
    }
    
    // 计算校验位
    return ((10 - (sum % 10)) % 10).toString();
  }
  
  /**
   * 格式化卡号以便显示
   * @param {string} cardNumber - 完整卡号
   * @param {string} cardType - 卡类型
   * @return {string} - 格式化的卡号
   */
  function formatCardNumber(cardNumber, selectedType) {
    if (selectedType === 'amex') {
      // Amex格式: XXXX XXXXXX XXXXX
      return `${cardNumber.substring(0, 4)} ${cardNumber.substring(4, 10)} ${cardNumber.substring(10)}`;
    } else {
      // Visa/万事达卡/Discover/JCB格式: XXXX XXXX XXXX XXXX
      return `${cardNumber.substring(0, 4)} ${cardNumber.substring(4, 8)} ${cardNumber.substring(8, 12)} ${cardNumber.substring(12)}`;
    }
  }
  
  /**
   * 复制所有卡信息到剪贴板
   */
  function copyToClipboard() {
    // 如果还没有生成卡号，提示用户先生成一个
    if (!currentCardData.number) {
      alert('Please generate a card number first.');
      return;
    }
    
    // 准备要复制的JSON格式文本内容
    const copyData = {
      card_number: currentCardData.number.replace(/\s/g, ''),
      expiry: currentCardData.expiry,
      cvv: currentCardData.cvv
    };
    
    const jsonString = JSON.stringify(copyData, null, 2);
    
    // 使用剪贴板API复制到剪贴板
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        // 显示复制成功动画
        showCopySuccessAnimation('Card information copied to clipboard (JSON format)');
      })
      .catch(err => {
        console.error('Failed to copy card details:', err);
        alert('Copy failed. Please select and copy manually.');
      });
  }
  
  /**
   * 仅复制卡号到剪贴板
   */
  function copyCardNumber() {
    // 如果还没有生成卡号，提示用户先生成一个
    if (!currentCardData.number) {
      alert('Please generate a card number first.');
      return;
    }
    
    // 仅复制卡号，使用JSON格式
    const copyData = {
      card_number: currentCardData.number.replace(/\s/g, '')
    };
    
    const jsonString = JSON.stringify(copyData, null, 2);
    
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        // 显示复制成功动画
        showCopySuccessAnimation('Card number copied to clipboard (JSON format)');
      })
      .catch(err => {
        console.error('Failed to copy card number:', err);
        alert('Copy failed. Please select and copy manually.');
      });
  }
  
  /**
   * 显示复制成功动画
   * @param {string} message - 要显示的消息文本
   */
  function showCopySuccessAnimation(message = 'Card information copied to clipboard') {
    // 创建复制成功提示元素
    const successToast = document.createElement('div');
    successToast.className = 'fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 transition-all duration-500 transform';
    successToast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <span>${message}</span>
    `;
    
    // 将提示添加到页面
    document.body.appendChild(successToast);
    
    // 添加入场动画
    setTimeout(() => {
      successToast.classList.add('translate-y-0');
    }, 10);
    successToast.classList.add('-translate-y-4');
    
    // 2秒后自动移除提示
    setTimeout(() => {
      successToast.classList.add('opacity-0');
      successToast.classList.add('translate-y-4');
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 500);
    }, 2000);
  }
}); 