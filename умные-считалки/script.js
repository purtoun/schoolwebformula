/* =====================================================
   УМНЫЕ СЧИТАЛКИ — логика кастомных элементов-калькуляторов
   Каждый калькулятор — отдельный тег: <rect-calc>, <quadratic-calc> и т.д.
   Внутри каждого тега id полей уникальны только в пределах карточки,
   поэтому поиск идёт через el.querySelector, а не document.getElementById.
   ===================================================== */

// ---------- Вспомогательные функции ----------

/** Взять число из input по id внутри компонента */
function getNum(el, id) {
  const input = el.querySelector("#" + id);
  if (!input) return NaN;
  const raw = input.value.trim().replace(",", ".");
  if (raw === "") return NaN;
  return Number(raw);
}

/** Округление до 4 знаков без «хвостов» */
function fmt(n) {
  if (!isFinite(n)) return String(n);
  return parseFloat(n.toFixed(4)).toString();
}

/** Показать результат */
function showResult(el, text, isError = false) {
  const out = el.querySelector(".result");
  if (!out) return;
  out.textContent = text;
  out.classList.toggle("error", isError);
}

/** Базовый класс для всех калькуляторов */
class CalcBase extends HTMLElement {
  connectedCallback() {
    // дочерний HTML уже есть в разметке — просто вешаем обработчик
    const btn = this.querySelector("button.btn");
    if (btn) {
      btn.addEventListener("click", () => this.calculate());
    }
    // Enter в полях тоже считает
    this.querySelectorAll("input").forEach((inp) => {
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.calculate();
      });
    });
  }

  /** все поля заполнены числами? */
  require(...values) {
    if (values.some((v) => isNaN(v))) {
      showResult(this, "Заполни все поля корректными чисами ✍️", true);
      return false;
    }
    return true;
  }

  positive(...values) {
    if (values.some((v) => v <= 0)) {
      showResult(this, "Значения должны быть больше нуля 📏", true);
      return false;
    }
    return true;
  }

  calculate() {} // переопределяется в наследниках
}

/* =====================================================
   ГЕОМЕТРИЯ — «Магия фигур»
   ===================================================== */

// Площадь и периметр прямоугольника
class RectCalc extends CalcBase {
  calculate() {
    const [a, b] = [getNum(this, "a"), getNum(this, "b")];
    if (!this.require(a, b) || !this.positive(a, b)) return;
    showResult(this, `S = ${fmt(a * b)}   •   P = ${fmt(2 * (a + b))}`);
  }
}

// Площадь треугольника (основание и высота)
class TriangleCalc extends CalcBase {
  calculate() {
    const [a, h] = [getNum(this, "a"), getNum(this, "h")];
    if (!this.require(a, h) || !this.positive(a, h)) return;
    showResult(this, `S = ½ · a · h = ${fmt((a * h) / 2)}`);
  }
}

// Круг: длина окружности и площадь
class CircleCalc extends CalcBase {
  calculate() {
    const r = getNum(this, "r");
    if (!this.require(r) || !this.positive(r)) return;
    showResult(
      this,
      `L = 2πr = ${fmt(2 * Math.PI * r)}\nS = πr² = ${fmt(Math.PI * r * r)}`
    );
  }
}

// Теорема Пифагора — поиск гипотенузы
class PythagorasCalc extends CalcBase {
  calculate() {
    const [a, b] = [getNum(this, "a"), getNum(this, "b")];
    if (!this.require(a, b) || !this.positive(a, b)) return;
    const c = Math.hypot(a, b);
    showResult(this, `c = √(a² + b²) = ${fmt(c)}`);
  }
}

// Объём прямоугольного параллелепипеда
class BoxCalc extends CalcBase {
  calculate() {
    const [a, b, c] = [getNum(this, "a"), getNum(this, "b"), getNum(this, "c")];
    if (!this.require(a, b, c) || !this.positive(a, b, c)) return;
    showResult(
      this,
      `V = a·b·c = ${fmt(a * b * c)}\nS пов. = ${fmt(2 * (a * b + a * c + b * c))}`
    );
  }
}

/* =====================================================
   АЛГЕБРА — «Формулы-помощники»
   ===================================================== */

// Квадратное уравнение по коэффициентам
class QuadraticCalc extends CalcBase {
  calculate() {
    const [a, b, c] = [getNum(this, "a"), getNum(this, "b"), getNum(this, "c")];
    if (!this.require(a, b, c)) return;
    if (a === 0) {
      showResult(this, "Коэффициент a ≠ 0, иначе это не квадратное уравнение 😉", true);
      return;
    }
    const d = b * b - 4 * a * c;
    if (d > 0) {
      const x1 = (-b + Math.sqrt(d)) / (2 * a);
      const x2 = (-b - Math.sqrt(d)) / (2 * a);
      showResult(this, `D = ${fmt(d)}\nx₁ = ${fmt(x1)}\nx₂ = ${fmt(x2)}`);
    } else if (d === 0) {
      const x = -b / (2 * a);
      showResult(this, `D = 0\nx = ${fmt(x)} (единственный корень)`);
    } else {
      showResult(this, `D = ${fmt(d)} < 0\nДействительных корней нет 🌪`);
    }
  }
}

// Арифметическая прогрессия: n-й член и сумма n первых
class ArithProgCalc extends CalcBase {
  calculate() {
    const [a1, d, n] = [getNum(this, "a1"), getNum(this, "d"), getNum(this, "n")];
    if (!this.require(a1, d, n)) return;
    if (n < 1 || !Number.isInteger(n)) {
      showResult(this, "n должно быть натуральным числом (1, 2, 3…)", true);
      return;
    }
    const an = a1 + d * (n - 1);
    const sn = ((a1 + an) / 2) * n;
    showResult(this, `a${n} = ${fmt(an)}\nS${n} = ${fmt(sn)}`);
  }
}

// Проценты: сколько составляет X% от числа
class PercentCalc extends CalcBase {
  calculate() {
    const [p, x] = [getNum(this, "p"), getNum(this, "x")];
    if (!this.require(p, x)) return;
    showResult(this, `${fmt(p)}% от ${fmt(x)} = ${fmt((p / 100) * x)}`);
  }
}

// Степени и корни
class PowerRootCalc extends CalcBase {
  calculate() {
    const [base, exp] = [getNum(this, "base"), getNum(this, "exp")];
    if (!this.require(base, exp)) return;
    showResult(this, `${fmt(base)} ^ ${fmt(exp)} = ${fmt(Math.pow(base, exp))}`);
  }
}

/* =====================================================
   ФИЗИКА — «Законы в одну кнопку»
   ===================================================== */

// Скорость: v = s / t
class SpeedCalc extends CalcBase {
  calculate() {
    const [s, t] = [getNum(this, "s"), getNum(this, "t")];
    if (!this.require(s, t) || !this.positive(s, t)) return;
    showResult(this, `v = s / t = ${fmt(s / t)} м/с`);
  }
}

// Второй закон Ньютона: F = m·a
class ForceCalc extends CalcBase {
  calculate() {
    const [m, a] = [getNum(this, "m"), getNum(this, "a")];
    if (!this.require(m, a) || !this.positive(m, a)) return;
    showResult(this, `F = m·a = ${fmt(m * a)} Н`);
  }
}

// Плотность: ρ = m / V
class DensityCalc extends CalcBase {
  calculate() {
    const [m, v] = [getNum(this, "m"), getNum(this, "v")];
    if (!this.require(m, v) || !this.positive(m, v)) return;
    showResult(this, `ρ = m / V = ${fmt(m / v)} кг/м³`);
  }
}

// Работа и мощность: A = F·s, N = A/t
class WorkPowerCalc extends CalcBase {
  calculate() {
    const [f, s, t] = [getNum(this, "f"), getNum(this, "s"), getNum(this, "t")];
    if (!this.require(f, s, t) || !this.positive(f, s, t)) return;
    const work = f * s;
    showResult(this, `A = F·s = ${fmt(work)} Дж\nN = A/t = ${fmt(work / t)} Вт`);
  }
}

// Закон Ома: I = U / R
class OhmCalc extends CalcBase {
  calculate() {
    const [u, r] = [getNum(this, "u"), getNum(this, "r")];
    if (!this.require(u, r) || !this.positive(r)) return;
    showResult(this, `I = U / R = ${fmt(u / r)} А`);
  }
}

// ---------- Регистрация тегов ----------
customElements.define("rect-calc", RectCalc);
customElements.define("triangle-calc", TriangleCalc);
customElements.define("circle-calc", CircleCalc);
customElements.define("pythagoras-calc", PythagorasCalc);
customElements.define("box-calc", BoxCalc);

customElements.define("quadratic-calc", QuadraticCalc);
customElements.define("arith-prog-calc", ArithProgCalc);
customElements.define("percent-calc", PercentCalc);
customElements.define("power-root-calc", PowerRootCalc);

customElements.define("speed-calc", SpeedCalc);
customElements.define("force-calc", ForceCalc);
customElements.define("density-calc", DensityCalc);
customElements.define("work-power-calc", WorkPowerCalc);
customElements.define("ohm-calc", OhmCalc);

// ---------- Подсветка активного пункта меню при прокрутке ----------
const sections = document.querySelectorAll("section.section");
const navLinks = document.querySelectorAll("nav.main-nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((sec) => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
});
