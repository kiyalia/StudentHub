/* StudentHub - Practical 5: Registration form validation (regular expressions) */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  /* ---------- Regular expressions ---------- */
  const rx = {
    name:   /^[A-Za-z][A-Za-z .'-]{2,49}$/,                       // 3-50 letters
    email:  /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/,
    mobile: /^[6-9]\d{9}$/,                                       // Indian mobile
    pass:   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
  };

  const $ = id => document.getElementById(id);
  const f = { name: $("fullName"), email: $("email"), mobile: $("mobile"), pass: $("password"),
              confirm: $("confirmPassword"), course: $("course"), year: $("year"),
              terms: $("terms"), captcha: $("captchaInput") };

  function setError(input, errId, msg) {
    $(errId).textContent = msg;
    if (input && input.classList) {
      input.classList.toggle("invalid", !!msg);
      input.classList.toggle("valid", !msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
    }
    return !msg;
  }

  /* ---------- CAPTCHA using Canvas ---------- */
  const canvas = $("captchaCanvas"), ctx = canvas.getContext("2d");
  let captchaText = "";
  function makeCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    captchaText = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#eef2ff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 6; i++) {                                  // noise lines
      ctx.strokeStyle = `hsl(${Math.random() * 360},60%,60%)`;
      ctx.beginPath(); ctx.moveTo(Math.random() * 150, Math.random() * 46);
      ctx.lineTo(Math.random() * 150, Math.random() * 46); ctx.stroke();
    }
    ctx.font = "bold 28px monospace"; ctx.textBaseline = "middle";
    captchaText.split("").forEach((ch, i) => {
      ctx.save(); ctx.translate(15 + i * 27, 24);
      ctx.rotate((Math.random() - 0.5) * 0.5);
      ctx.fillStyle = "#312e81"; ctx.fillText(ch, 0, 0); ctx.restore();
    });
  }
  makeCaptcha();
  $("refreshCaptcha").addEventListener("click", makeCaptcha);

  /* ---------- Individual validators ---------- */
  const v = {
    name:    () => setError(f.name, "fullName-err", !f.name.value.trim() ? "Full name is required." :
                    !rx.name.test(f.name.value.trim()) ? "Use 3-50 letters only (no digits or symbols)." : ""),
    email:   () => setError(f.email, "email-err", !f.email.value.trim() ? "Email is required." :
                    !rx.email.test(f.email.value.trim()) ? "Enter a valid email, e.g. name@example.com." : ""),
    mobile:  () => setError(f.mobile, "mobile-err", !f.mobile.value ? "Mobile number is required." :
                    !rx.mobile.test(f.mobile.value) ? "Enter a valid 10-digit number starting with 6-9." : ""),
    pass:    () => setError(f.pass, "password-err", !f.pass.value ? "Password is required." :
                    !rx.pass.test(f.pass.value) ? "Min 8 chars with upper, lower, digit and special character." : ""),
    confirm: () => setError(f.confirm, "confirmPassword-err", !f.confirm.value ? "Please confirm your password." :
                    f.confirm.value !== f.pass.value ? "Passwords do not match." : ""),
    course:  () => setError(f.course, "course-err", f.course.value ? "" : "Please select a course."),
    year:    () => setError(f.year, "year-err", f.year.value ? "" : "Please select your year."),
    gender:  () => setError(null, "gender-err", form.querySelector('input[name="gender"]:checked') ? "" : "Please select a gender."),
    captcha: () => setError(f.captcha, "captcha-err", !f.captcha.value ? "Enter the captcha text." :
                    f.captcha.value.toUpperCase() !== captchaText ? "Captcha does not match. Try again." : ""),
    terms:   () => setError(null, "terms-err", f.terms.checked ? "" : "You must accept the terms and conditions.")
  };

  /* ---------- Password strength meter ---------- */
  const bar = $("strengthBar"), txt = $("strength-text");
  function strength(p) {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;                                                      // 0-4
  }
  f.pass.addEventListener("input", () => {
    const s = strength(f.pass.value);
    const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["#991b1b", "#dc2626", "#f59e0b", "#3b82f6", "#16a34a"];
    bar.style.width = (f.pass.value ? Math.max(s, 0.5) * 25 : 0) + "%";
    bar.style.background = colors[s];
    txt.textContent = "Password strength: " + (f.pass.value ? labels[s] : "-");
  });

  /* ---------- Real-time validation (input / change / blur) ---------- */
  [["name","input"],["email","input"],["mobile","input"],["pass","input"],["confirm","input"],
   ["captcha","input"]].forEach(([k, ev]) => f[k].addEventListener(ev, v[k]));
  f.pass.addEventListener("input", () => { if (f.confirm.value) v.confirm(); });
  f.course.addEventListener("change", v.course);
  f.year.addEventListener("change", v.year);
  f.terms.addEventListener("change", v.terms);
  form.querySelectorAll('input[name="gender"]').forEach(r => r.addEventListener("change", v.gender));
  f.mobile.addEventListener("input", () => { f.mobile.value = f.mobile.value.replace(/\D/g, ""); });

  /* ---------- Submit ---------- */
  form.addEventListener("submit", e => {
    e.preventDefault();
    const results = Object.keys(v).map(k => v[k]());
    const ok = results.every(Boolean);
    const msg = $("formSuccess");
    if (ok) {
      msg.textContent = "\u2705 Registration successful! Welcome to StudentHub, " + f.name.value.trim() + ".";
      msg.hidden = false;
    } else {
      msg.hidden = true;
      const firstBad = form.querySelector(".invalid"); if (firstBad) firstBad.focus();
    }
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      form.querySelectorAll(".error").forEach(el => el.textContent = "");
      form.querySelectorAll(".valid,.invalid").forEach(el => el.classList.remove("valid", "invalid"));
      bar.style.width = "0"; txt.textContent = "Password strength: -"; $("formSuccess").hidden = true; makeCaptcha();
    });
  });
});
