function augmentIkaFight() {
  var specs = (location.hash||"#").slice(1);
  if (window != top) {
    document.body.style.background = "none";
    if (specs)
      window.name = specs;
    else
      specs = window.name;
  }
  var args = urlParse(null, specs);
  for (var n in args) {
    var td = $X('//td[.="'+ n +'"]');
    if (!td) continue;
    var v, a, d, f, A, D;
    [v, a, d, f, A, D] = args[n].split(".").concat(0, 0, 0, 0, 0);
    var input = $x('following::input', td);
    if (!input) return;
    input[0].value = v;
    if (a) input[a].checked = true;
    if (d) input[integer(d)+3].checked = true;
    if (f) input[7].value = f;
    if (A) input[integer(A)+7].checked = true;
    if (D) input[integer(D)+10].checked = true;
  }
  scrollWheelable($x('//input[@type="text"]'));
}
