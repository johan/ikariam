revision("$Revision$");

function augmentIkaFight() {
  if (location.hostname != "ikariamlibrary.com") return;
  css("@import url('http://hacks.ecmanaut.googlepages.com/IkaFight.css');");
  $x('//td[input[@checked="checked"]]|//th[.="-"]').map(hide);
  $x('//td[@colspan="5"]').map(function(x){ x.setAttribute("colspan", "3"); });
  $x('//td[@colspan="8"]').map(function(x){ x.setAttribute("colspan", "6"); });
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
    if (a) input[integer(a)+1].checked = true;
    if (d) input[integer(d)+5].checked = true;
    if (f) input[7].value = f;
    if (A) input[integer(A)+10].checked = true;
    if (D) input[integer(D)+14].checked = true;
  }
  scrollWheelable($x('//input[@type="text"]'));
}
