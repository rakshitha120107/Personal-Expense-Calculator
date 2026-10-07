"use strict";
let expenses = [];
const KEY = "expenseCalc.v1";
const BENCH = {Food:25, Transport:10, Rent:30, Education:15, Entertainment:8, Other:10};
let store = {name:"", months:{}};
function loadStore(){ try{ const d = JSON.parse(localStorage.getItem(KEY)); if(d && d.months) store = d; }catch(e){} }
function saveStore(){ try{ localStorage.setItem(KEY, JSON.stringify(store)); return true; }catch(e){ return false; } }
const $ = id => document.getElementById(id);
const money = n => "Rs " + n.toLocaleString("en-IN", {minimumFractionDigits:2, maximumFractionDigits:2});
const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function totalByCategory(list){
  const t = {};
  for (const e of list) t[e.cat] = (t[e.cat] || 0) + e.amount;
  return t;
}
function savingsMessage(income, savings){
  if (income <= 0) return "Enter your income to see savings advice.";
  const rate = savings / income * 100;
  if (savings < 0) return "Warning: you are overspending!";
  if (rate >= 20) return "Great job! You are saving 20% or more.";
  if (rate >= 10) return "Good, but try to save a little more.";
  return "Low savings. Review your expenses.";
}
function render(){
  const income = parseFloat($("income").value) || 0;
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const savings = income - total;
  $("sInc").textContent = money(income);
  $("sExp").textContent = money(total);
  $("sSav").textContent = money(savings);
  $("sSav").className = savings < 0 ? "neg" : "pos";
  $("msg").textContent = savingsMessage(income, savings);

  const totals = Object.entries(totalByCategory(expenses)).sort((a, b) => b[1] - a[1]);
  $("cats").innerHTML = totals.length
    ? totals.map(([c, a]) => { const p = a / total * 100;
        return `<div class="row"><span>${c}</span><div class="bar"><i style="width:${p}%"></i></div><span>${p.toFixed(1)}%</span></div>`; }).join("")
      + `<p class="msg">Highest spending: ${totals[0][0]} (${money(totals[0][1])})</p>`
    : '<p class="empty">No expenses yet.</p>';

  renderExtras(income, total, savings, totals);
  $("list").innerHTML = expenses.length
    ? expenses.map((e, i) => `<tr><td>${esc(e.name)}</td><td>${e.cat}</td><td class="n">${money(e.amount)}</td><td><button class="link" data-i="${i}" aria-label="Delete ${esc(e.name)}">Delete</button></td></tr>`).join("")
    : '<tr><td colspan="4" class="empty">Nothing added yet.</td></tr>';
}
function prevMonth(m){ const ks = Object.keys(store.months).filter(k => k < m).sort(); return ks.length ? ks[ks.length-1] : null; }
function sumOf(rec){ return rec.expenses.reduce((s,e)=>s+e.amount,0); }
function tip(kind, title, text){ return `<div class="tip ${kind}"><b>${title}</b>${esc(text)}</div>`; }
function renderExtras(income, total, savings, totals){
  const m = $("month").value, out = [];
  $("who").textContent = store.name || "you";
  if (income > 0 && expenses.length){
    const target = income * 0.2;
    if (savings < 0) out.push(tip("down","Decrease spending","You spend Rs " + Math.abs(savings).toFixed(0) + " more than you earn. Cut this first."));
    else if (savings < target) out.push(tip("up","Increase savings","Save about Rs " + (target - savings).toFixed(0) + " more per month to reach the 20% goal (Rs " + target.toFixed(0) + ")."));
    else out.push(tip("up","Increase investment","You meet the 20% goal. Move part of it to an emergency fund (3 to 6 months of expenses) or a monthly SIP."));
    for (const [c, a] of totals){
      const pct = a / income * 100, max = BENCH[c];
      if (pct > max) out.push(tip("down","Decrease " + c, c + " is " + pct.toFixed(0) + "% of your income (suggested max " + max + "%). Try cutting about Rs " + (a - income*max/100).toFixed(0) + "."));
    }
    const pm = prevMonth(m);
    if (pm){
      const prev = store.months[pm], pt = totalByCategory(prev.expenses);
      for (const [c, a] of totals){
        const d = a - (pt[c] || 0);
        if (d > 0) out.push(tip("down", c + " went up", c + " is up by Rs " + d.toFixed(0) + " compared with " + pm + ". Try to bring it back down."));
        else if (d < 0) out.push(tip("up", c + " improved", "You spent Rs " + Math.abs(d).toFixed(0) + " less on " + c + " than in " + pm + ". Keep it up."));
      }
      const goal = Math.max(target, income - sumOf(prev));
      out.push(tip("up","Goal for this month","Aim to save at least Rs " + goal.toFixed(0) + ", which is last month's savings or 20% of income, whichever is higher."));
    }
  }
  $("tips").innerHTML = out.length ? out.join("") : '<p class="empty">Add income and expenses to get suggestions.</p>';
  renderHistory();
}
function renderHistory(){
  const keys = Object.keys(store.months).sort();
  let prev = null;
  $("hist").innerHTML = keys.length ? keys.map(k => {
    const r = store.months[k], t = sumOf(r), sv = r.income - t, rate = r.income ? (sv / r.income * 100).toFixed(1) + "%" : "-";
    let ch = "First month";
    if (prev !== null){ const d = sv - prev; ch = d > 0 ? `<span class="pos">Up Rs ${d.toFixed(0)}</span>` : d < 0 ? `<span class="neg">Down Rs ${Math.abs(d).toFixed(0)}</span>` : "No change"; }
    prev = sv;
    return `<tr><td>${k}</td><td class="n">${money(r.income)}</td><td class="n">${money(t)}</td><td class="n">${money(sv)}</td><td class="n">${rate}</td><td>${ch}</td></tr>`;
  }).join("") : '<tr><td colspan="6" class="empty">No saved months yet. Click "Save this month".</td></tr>';
  if (keys.length >= 2){
    const a = store.months[keys[keys.length-2]], b = store.months[keys[keys.length-1]];
    const d = (b.income - sumOf(b)) - (a.income - sumOf(a));
    $("progress").textContent = d > 0 ? "Well done! You saved Rs " + d.toFixed(0) + " more in " + keys[keys.length-1] + " than the month before." : d < 0 ? "Savings fell by Rs " + Math.abs(d).toFixed(0) + " in " + keys[keys.length-1] + ". Check the suggestions above." : "Savings stayed the same as last month.";
  } else $("progress").textContent = keys.length ? "Save next month to see your improvement." : "";
}
function loadMonth(){
  const r = store.months[$("month").value];
  if (r){ $("income").value = r.income; expenses = r.expenses.map(e => ({...e})); }
  else { $("income").value = ""; expenses = []; }
  render();
}
$("uname").addEventListener("input", () => { store.name = $("uname").value.trim(); saveStore(); $("who").textContent = store.name || "you"; });
$("month").addEventListener("change", loadMonth);
$("saveMonth").addEventListener("click", () => {
  const income = parseFloat($("income").value);
  if (!$("month").value || isNaN(income)) return $("saved").textContent = "Choose a month and enter income first.";
  store.months[$("month").value] = {income, expenses: expenses.map(e => ({...e}))};
  const ok = saveStore();
  $("saved").textContent = ok ? "Saved " + $("month").value + (store.name ? " for " + store.name : "") + ". Come back next month to track your improvement." : "Could not save in this browser (storage blocked).";
  render();
});
$("form").addEventListener("submit", ev => {
  ev.preventDefault();
  const name = $("name").value.trim(), amount = parseFloat($("amount").value);
  if (!name) return $("err").textContent = "Enter an expense name.";
  if (isNaN(amount) || amount < 0) return $("err").textContent = "Enter a valid amount (0 or more).";
  $("err").textContent = "";
  expenses.push({name, amount, cat: $("cat").value});
  $("name").value = ""; $("amount").value = ""; $("name").focus();
  render();
});
$("list").addEventListener("click", ev => {
  const b = ev.target.closest("button[data-i]");
  if (b){ expenses.splice(+b.dataset.i, 1); render(); }
});
$("clear").addEventListener("click", () => { expenses = []; render(); });
$("income").addEventListener("input", render);
loadStore();
$("uname").value = store.name || "";
$("month").value = new Date().toISOString().slice(0,7);
loadMonth();