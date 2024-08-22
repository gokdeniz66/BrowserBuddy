function addMario() {
  const character = document.createElement("img");
  character.id = "mario-character";
  character.src = chrome.runtime.getURL("images/mario-walking.gif");
  character.style.position = "fixed";
  character.style.width = "150px";
  character.style.height = "150px";
  character.style.zIndex = "1000";
  document.body.appendChild(character);

  const textBubble = document.createElement("div");
  textBubble.id = "text-bubble";
  textBubble.style.position = "fixed";
  textBubble.style.color = "black";
  textBubble.style.backgroundColor = "white";
  textBubble.style.border = "1px solid black";
  textBubble.style.borderRadius = "10px";
  textBubble.style.padding = "5px";
  textBubble.style.display = "none";
  textBubble.style.zIndex = "1001";
  document.body.appendChild(textBubble);

  const textMessages = [
    "Hello there!",
    "How are you today?",
    "Have a great day!",
    "الى ماذا تنظر؟",
    "زنجي",
    "(͡ ͡° ͜ つ ͡͡°)",
  ];

  let currentMessageIndex = 0;
  let currentIndex = 0;
  let typingInterval;

  function typeText() {
    const textMessage = textMessages[currentMessageIndex];
    if (currentIndex < textMessage.length) {
      textBubble.innerHTML +=
        textMessage[currentIndex] === " "
          ? "&nbsp;"
          : textMessage[currentIndex];
      currentIndex++;
      typingInterval = setTimeout(typeText, 150);
    } else {
      clearInterval(typingInterval);
      setTimeout(() => {
        character.src = chrome.runtime.getURL("images/mario-walking.gif");
        walking = true;
        textBubble.style.display = "none";
        currentMessageIndex = (currentMessageIndex + 1) % textMessages.length;
        startStatusCycle();
      }, 1000);
    }
  }

  let walking = true;
  let directionX = 1;
  let directionY = 1;

  function getRandomPosition() {
    const randomX = Math.floor(Math.random() * (window.innerWidth - 150));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 150));
    return { x: randomX, y: randomY };
  }

  function moveCharacter() {
    if (walking) {
      const currentLeft = parseInt(character.style.left, 10) || 0;
      const currentTop = parseInt(character.style.top, 10) || 0;

      if (currentLeft >= window.innerWidth - 150 || currentLeft <= 0) {
        directionX *= -1;
      }
      if (currentTop >= window.innerHeight - 150 || currentTop <= 0) {
        directionY *= -1;
      }

      const speed = 2;
      character.style.left = `${currentLeft + speed * directionX}px`;
      character.style.top = `${currentTop + speed * directionY}px`;

      character.style.transform =
        directionX === -1 ? "scaleX(1)" : "scaleX(-1)";
    }
    requestAnimationFrame(moveCharacter);
  }

  function switchToStanding() {
    walking = false;
    character.src = chrome.runtime.getURL("images/mario-front.png");
    textBubble.style.display = "block";

    const characterRect = character.getBoundingClientRect();
    textBubble.style.left = `${characterRect.left}px`;
    textBubble.style.top = `${characterRect.top - 40}px`;

    currentIndex = 0;
    textBubble.innerHTML = "";
    typeText();
  }

  function startStatusCycle() {
    setTimeout(() => {
      switchToStanding();
    }, 10000);
  }

  const startPosition = getRandomPosition();
  character.style.left = `${startPosition.x}px`;
  character.style.top = `${startPosition.y}px`;

  moveCharacter();
  startStatusCycle();
}

addMario();