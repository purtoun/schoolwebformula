/* =====================================================
   ФОРМУЛЫ ОНЛАЙН — простой JavaScript
   Здесь нет никаких сложных вещей:
   - getElementById — находит элемент на странице по его id
   - Number(...) — превращает текст из поля в число
   - if / else — проверки
   - обычные функции
   ===================================================== */

// ---------- Вспомогательные (помогающие) функции ----------

// Взять число из поля с нужным id. Если поле пустое или там не число — вернёт NaN
function getNumber(id) {
  var text = document.getElementById(id).value;
  text = text.replace(",", "."); // если написали запятую (5,5) — заменим на точку (5.5)
  return Number(text);
}

// Проверка: все ли числа нормальные. Если нет — покажет ошибку и вернёт false
function checkNumbers(cardId, numbers) {
  for (var i = 0; i < numbers.length; i++) {
    if (isNaN(numbers[i])) {
      showResult(cardId, "Заполни все поля числами ✍️", true);
      return false;
    }
  }
  return true;
}

// Показать ответ в блоке result внутри карточки
function showResult(cardId, text, isError) {
  var out = document.querySelector("#" + cardId + " .result");
  out.textContent = text;
  if (isError) {
    out.classList.add("error");
  } else {
    out.classList.remove("error");
  }
}

// Округлить число до 4 знаков, чтобы не было длинных «хвостов» типа 18.84955592153876
function round4(n) {
  return Math.round(n * 10000) / 10000;
}

// ---------- ГЕОМЕТРИЯ ----------

// Прямоугольник: площадь S = a·b и периметр P = 2·(a + b)
function rectCalc() {
  var a = getNumber("rect-a");
  var b = getNumber("rect-b");
  if (!checkNumbers("rect-card", [a, b])) return;
  if (a <= 0 || b <= 0) {
    showResult("rect-card", "Стороны должны быть больше нуля 📏", true);
    return;
  }
  showResult("rect-card", "S = " + round4(a * b) + "   •   P = " + round4(2 * (a + b)));
}

// Треугольник: площадь S = половина · основание · высота
function triangleCalc() {
  var a = getNumber("tri-a");
  var h = getNumber("tri-h");
  if (!checkNumbers("tri-card", [a, h])) return;
  if (a <= 0 || h <= 0) {
    showResult("tri-card", "Стороны должны быть больше нуля 📏", true);
    return;
  }
  showResult("tri-card", "S = ½ · a · h = " + round4((a * h) / 2));
}

// Круг: длина окружности L = 2πr и площадь S = πr²
function circleCalc() {
  var r = getNumber("circle-r");
  if (!checkNumbers("circle-card", [r])) return;
  if (r <= 0) {
    showResult("circle-card", "Радиус должен быть больше нуля 📏", true);
    return;
  }
  showResult(
    "circle-card",
    "L = 2πr = " + round4(2 * Math.PI * r) + "\nS = πr² = " + round4(Math.PI * r * r)
  );
}

// Теорема Пифагора: гипотенуза c = корень из (a² + b²)
function pythagorasCalc() {
  var a = getNumber("pyth-a");
  var b = getNumber("pyth-b");
  if (!checkNumbers("pyth-card", [a, b])) return;
  if (a <= 0 || b <= 0) {
    showResult("pyth-card", "Катеты должны быть больше нуля 📏", true);
    return;
  }
  var c = Math.sqrt(a * a + b * b);
  showResult("pyth-card", "c = √(a² + b²) = " + round4(c));
}

// Параллелепипед: объём V = a·b·c и площадь поверхности S = 2·(ab + ac + bc)
function boxCalc() {
  var a = getNumber("box-a");
  var b = getNumber("box-b");
  var c = getNumber("box-c");
  if (!checkNumbers("box-card", [a, b, c])) return;
  if (a <= 0 || b <= 0 || c <= 0) {
    showResult("box-card", "Стороны должны быть больше нуля 📏", true);
    return;
  }
  showResult(
    "box-card",
    "V = a·b·c = " + round4(a * b * c) + "\nS поверхности = " + round4(2 * (a * b + a * c + b * c))
  );
}

// ---------- АЛГЕБРА ----------

// Квадратное уравнение ax² + bx + c = 0: ищем дискриминант и корни
function quadraticCalc() {
  var a = getNumber("quad-a");
  var b = getNumber("quad-b");
  var c = getNumber("quad-c");
  if (!checkNumbers("quad-card", [a, b, c])) return;
  if (a === 0) {
    showResult("quad-card", "Коэффициент a не может быть равен нулю, иначе уравнение не квадратное 😉", true);
    return;
  }
  var d = b * b - 4 * a * c; // дискриминант
  if (d > 0) {
    var x1 = (-b + Math.sqrt(d)) / (2 * a);
    var x2 = (-b - Math.sqrt(d)) / (2 * a);
    showResult("quad-card", "D = " + round4(d) + "\nx₁ = " + round4(x1) + "\nx₂ = " + round4(x2));
  } else if (d === 0) {
    var x = -b / (2 * a);
    showResult("quad-card", "D = 0\nx = " + round4(x) + " (единственный корень)");
  } else {
    showResult("quad-card", "D = " + round4(d) + ", он меньше нуля\nДействительных корней нет 🌪");
  }
}

// Арифметическая прогрессия: n-й член и сумма первых n членов
function progCalc() {
  var a1 = getNumber("prog-a1");
  var d = getNumber("prog-d");
  var n = getNumber("prog-n");
  if (!checkNumbers("prog-card", [a1, d, n])) return;
  if (n < 1 || n !== Math.round(n)) {
    showResult("prog-card", "Номер n должен быть натуральным числом (1, 2, 3…)", true);
    return;
  }
  var an = a1 + d * (n - 1);          // формула n-го члена
  var sn = ((a1 + an) / 2) * n;       // формула суммы
  showResult("prog-card", "a" + n + " = " + round4(an) + "\nS" + n + " = " + round4(sn));
}

// Проценты: сколько составляет X процентов от числа Y
function percentCalc() {
  var p = getNumber("perc-p");
  var x = getNumber("perc-x");
  if (!checkNumbers("perc-card", [p, x])) return;
  showResult("perc-card", round4(p) + "% от числа " + round4(x) + " = " + round4((p / 100) * x));
}

// Степень: число a возводим в степень n (например 2 в степени 10)
function powerCalc() {
  var a = getNumber("pow-a");
  var n = getNumber("pow-n");
  if (!checkNumbers("pow-card", [a, n])) return;
  showResult("pow-card", round4(a) + " в степени " + round4(n) + " = " + round4(Math.pow(a, n)));
}

// ---------- ФИЗИКА ----------

// Скорость: v = s / t
function speedCalc() {
  var s = getNumber("speed-s");
  var t = getNumber("speed-t");
  if (!checkNumbers("speed-card", [s, t])) return;
  if (s <= 0 || t <= 0) {
    showResult("speed-card", "Значения должны быть больше нуля ⚡", true);
    return;
  }
  showResult("speed-card", "v = s / t = " + round4(s / t) + " м/с");
}

// Сила (второй закон Ньютона): F = m·a
function forceCalc() {
  var m = getNumber("force-m");
  var a = getNumber("force-a");
  if (!checkNumbers("force-card", [m, a])) return;
  if (m <= 0 || a <= 0) {
    showResult("force-card", "Значения должны быть больше нуля ⚡", true);
    return;
  }
  showResult("force-card", "F = m·a = " + round4(m * a) + " Н");
}

// Плотность: ρ = m / V
function densityCalc() {
  var m = getNumber("dens-m");
  var v = getNumber("dens-v");
  if (!checkNumbers("dens-card", [m, v])) return;
  if (m <= 0 || v <= 0) {
    showResult("dens-card", "Значения должны быть больше нуля ⚡", true);
    return;
  }
  showResult("dens-card", "ρ = m / V = " + round4(m / v) + " кг/м³");
}

// Работа и мощность: A = F·s, а потом N = A / t
function workCalc() {
  var f = getNumber("work-f");
  var s = getNumber("work-s");
  var t = getNumber("work-t");
  if (!checkNumbers("work-card", [f, s, t])) return;
  if (f <= 0 || s <= 0 || t <= 0) {
    showResult("work-card", "Значения должны быть больше нуля ⚡", true);
    return;
  }
  var a = f * s;
  showResult("work-card", "A = F·s = " + round4(a) + " Дж\nN = A / t = " + round4(a / t) + " Вт");
}

// Закон Ома: I = U / R
function ohmCalc() {
  var u = getNumber("ohm-u");
  var r = getNumber("ohm-r");
  if (!checkNumbers("ohm-card", [u, r])) return;
  if (r <= 0) {
    showResult("ohm-card", "Сопротивление должно быть больше нуля ⚡", true);
    return;
  }
  showResult("ohm-card", "I = U / R = " + round4(u / r) + " А");
}

// ---------- Кнопки: вешаем функции на клики ----------

document.getElementById("rect-btn").addEventListener("click", rectCalc);
document.getElementById("triangle-btn").addEventListener("click", triangleCalc);
document.getElementById("circle-btn").addEventListener("click", circleCalc);
document.getElementById("pythagoras-btn").addEventListener("click", pythagorasCalc);
document.getElementById("box-btn").addEventListener("click", boxCalc);
document.getElementById("quadratic-btn").addEventListener("click", quadraticCalc);
document.getElementById("prog-btn").addEventListener("click", progCalc);
document.getElementById("percent-btn").addEventListener("click", percentCalc);
document.getElementById("power-btn").addEventListener("click", powerCalc);
document.getElementById("speed-btn").addEventListener("click", speedCalc);
document.getElementById("force-btn").addEventListener("click", forceCalc);
document.getElementById("density-btn").addEventListener("click", densityCalc);
document.getElementById("work-btn").addEventListener("click", workCalc);
document.getElementById("ohm-btn").addEventListener("click", ohmCalc);

// Enter в поле = то же самое, что клик по кнопке
document.querySelectorAll(".field input").forEach(function (input) {
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      document.querySelector("#" + input.closest(".calc-card").id + " button").click();
    }
  });
});

// ---------- Подсветка активного пункта меню при прокрутке ----------

var sections = document.querySelectorAll("section.section");
var navLinks = document.querySelectorAll("nav.main-nav a");

window.addEventListener("scroll", function () {
  var current = "";
  sections.forEach(function (sec) {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.id;
    }
  });
  navLinks.forEach(function (link) {
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
