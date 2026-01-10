const swiper = new Swiper('.swiper', {
  loop: true,

  slidesPerView: "auto", 
  centeredSlides: true, 
  spaceBetween: 20,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});