(function(){
  "use strict";

  /* ---------- Mobile nav toggle (simple: scroll to gallery) ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", function(){
      var target = document.querySelector("#collection");
      if (target) target.scrollIntoView({behavior:"smooth"});
    });
  }

  /* ---------- Category pills: smooth scroll + active state ---------- */
  var pills = document.querySelectorAll(".pill");
  var sections = document.querySelectorAll(".cat-section");

  pills.forEach(function(pill){
    pill.addEventListener("click", function(){
      var id = pill.getAttribute("data-target");
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  if ("IntersectionObserver" in window && sections.length){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          pills.forEach(function(p){ p.classList.remove("active"); });
          var match = document.querySelector('.pill[data-target="'+entry.target.id+'"]');
          if (match) match.classList.add("active");
        }
      });
    }, {rootMargin: "-160px 0px -70% 0px"});
    sections.forEach(function(s){ obs.observe(s); });
  }

  /* ---------- Live search across all cards ---------- */
  var searchInput = document.getElementById("productSearch");
  var allCards = document.querySelectorAll(".card");
  var emptyState = document.getElementById("emptyState");

  function runSearch(){
    var q = (searchInput.value || "").trim().toLowerCase();
    var visibleCount = 0;
    allCards.forEach(function(card){
      var hay = card.getAttribute("data-title") || "";
      var show = !q || hay.indexOf(q) !== -1;
      card.classList.toggle("is-hidden", !show);
      if (show) visibleCount++;
    });
    sections.forEach(function(sec){
      var visible = sec.querySelectorAll(".card:not(.is-hidden)").length;
      sec.style.display = visible === 0 ? "none" : "";
    });
    if (emptyState) emptyState.classList.toggle("show", visibleCount === 0);
  }
  if (searchInput){
    searchInput.addEventListener("input", runSearch);
  }

  /* ---------- Quote drawer ---------- */
  var overlay = document.getElementById("overlay");
  var drawer = document.getElementById("quoteDrawer");
  var openButtons = document.querySelectorAll("[data-open-quote]");
  var closeButtons = document.querySelectorAll("[data-close-quote]");
  var refField = document.getElementById("qRef");

  function openDrawer(ref){
    if (ref && refField) refField.value = ref;
    document.body.style.overflow = "hidden";
    overlay.classList.add("open");
    drawer.classList.add("open");
  }
  function closeDrawer(){
    document.body.style.overflow = "";
    overlay.classList.remove("open");
    drawer.classList.remove("open");
  }
  openButtons.forEach(function(btn){
    btn.addEventListener("click", function(){
      openDrawer(btn.getAttribute("data-product") || "General enquiry");
    });
  });
  closeButtons.forEach(function(btn){
    btn.addEventListener("click", closeDrawer);
  });
  if (overlay){
    overlay.addEventListener("click", closeDrawer);
  }
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape") closeDrawer();
  });

  /* ---------- Quote form -> FormSubmit.co (AJAX, stays on page) ---------- */
  var quoteForm = document.getElementById("quoteForm");
  var formPane = document.getElementById("formPane");
  var successPane = document.getElementById("successPane");

  if (quoteForm){
    quoteForm.addEventListener("submit", function(e){
      e.preventDefault();
      var submitBtn = quoteForm.querySelector(".drawer-submit");
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Sending…";
      submitBtn.disabled = true;

      var formData = new FormData(quoteForm);

      fetch(quoteForm.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      }).then(function(res){
        if (res.ok){
          formPane.style.display = "none";
          successPane.classList.add("show");
        } else {
          throw new Error("Submission failed");
        }
      }).catch(function(){
        // Fallback: submit normally (navigates to FormSubmit's confirmation page)
        quoteForm.removeEventListener("submit", arguments.callee);
        quoteForm.submit();
      }).finally(function(){
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      });
    });
  }

  /* ---------- Sticky top bar shrink shadow on scroll (perf-cheap) ---------- */
  var topbar = document.querySelector(".topbar");
  window.addEventListener("scroll", function(){
    if (!topbar) return;
    if (window.scrollY > 12) topbar.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
    else topbar.style.boxShadow = "none";
  }, {passive:true});

})();
