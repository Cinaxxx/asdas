const conf = require("../configs/sunucuayar.json")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");

    let iltifatSayi = 0;
    let iltifatlar = [
      "mucizelerden bahsediyordum. Tam o sırada gözlerin geldi aklıma.",
      "benim için mutluluğun tanımı, seninle birlikteyken geçirdiğim vakittir.",
      "mavi gözlerin, gökyüzü oldu dünyamın.",
      "seni gören kelebekler, narinliğin karşısında mest olur.",
      "parlayan gözlerin ile karanlık gecelerime ay gibi doğuyorsun.",
      "sabah olmuş. Sen mi uyandın yoksa gönlüme güneş mi doğdu.",
      "huzur kokuyor geçtiğin her yer.",
      "en güzel manzaramsın benim, seyretmeye doyamadığım.",
      "sen benim düşlerimin surete bürünmüş halisin.",
      "bir sahil kasabasının huzuru birikmiş yüzüne.",
      "gülüşünde nice ilaçlar var yarama merhem olan.",
      "gece nasıl sabahı bekliyorsa aydınlanmak için ben de seni öyle bekliyorum.",
      "ışığınla gecemi aydınlatıyorsun.",
      "yağmurdan sonra açan gök kuşağı gibisin, öyle güzel ve özel!",
      "öyle bir duru güzelliğin var ki, seni gören şairler bile adına günlerce şiir yazardı.",
      "gözlerinin hareketi bile yeter  benim aklımı başımdan almaya.",
      "seni kelimeler ile anlatmak çok zor. Muhteşem desem yine eksik kalıyor anlamın.",
      "güller bile kıskanır seni gördükleri zaman kendi güzelliklerini.",
      "hiç yazılmamış bir şiirsin sen, daha önce eşi benzeri olmayan.",
      "bu kadar muhteşem olamaz bir insan. Bu kadar kusursuz bu kadar mükemmel.. Kirpiklerinin dizilişi bile sırayla senin.",
      "adım şaire çıktı civarda. Kimse senin şiir olduğunun farkında değil henüz.",
      "senin güzelliğini anlatmaya dünyalar değil, lisanlar bile yetmez.",
      "etkili gülüş kavramını ben senden öğrendim.",
      "seni yanlışlıkla cennetten düşürmüşler. Dünyada yaşayan bir meleksin sen.",
      "seni anlatmaya kelimeler bulamıyorum. Nasıl anlatacağımı bilemediğim için seni kimselere anlatamıyorum.",
      "gözlerinin gördüğü her yer benimdir. Bakışına şahit olan her toprak benim de vatanımdır.",
      "gözlerinle baharı getirdin garip gönlüme.",
      "bir gülüşün ile çiçek açıyor bahçemdeki her bir çiçek.",
      "yuva kokuyor kucağın. Sarılınca seninle yuva kurası geliyor insanın.",
      "seni de bu dünyada görünce yaşama sebebimi anladım. Meğer senmişsin beni dünyada yaşamaya zorlayan.",
      "sen bu  dünyadaki bütün şarkıların tek sahibisin. Sana yazılıyor bütün şarkılar ve şiirler. Adın geçiyor bütün namelerde.",
      "sen benim yanımda olduğun sürece benim nerde olduğum hiç önemli değil .Kokunu aldığım her yer cennet bana.",
      "seni yüreğimde taşıyorum ben, sırtımda taşımak ne kelime. Ömrüm boyunca çekmeye hazırım her anlamda senin yükünü.",
      "hayatıma gelerek hayatımdaki bütün önemli şeylerin önemsiz olmasını sağladın. Artık sensin tek önem verdiğim şu hayatta.",
      "sen benim bu hayattaki en büyük duamsın.  Gözlerin adeta bir ay parçası. Işık oluyorsun karanlık gecelerime.",
      "aynı zaman diliminde yaşamak benim için büyük ödüldür.",
      "seninle aşkı yaşamak çok güzel bir şey ama sensiz kalma korkusunu düşünmek korkutuyor beni.",
      "seni severek meslek sahibi oldum ben. Seni sevmeye başladıkça şair oldum.",
      "gülüşün güzelliğine anlam katıyor. Gamzelerin ise bambaşka diyarların kapılarını açıyor.",
      "senin gülüşünü gördüğüm günden beri ağlamalarımı unuttum.",
      "kimse konuşmasın yalnız sen konuş bana. Yalnız sen bak gözlerimin içine. Kimse olmasın yalnızca sen ol benim hayatımda.",
      "ben seninle birlikte yaşayabilmek için ikinci kere geldim hayata.",
      "senin attığın adımlarda seni korumak için geçtiğin yol olmak isterdim. Seni emniyete alan ve sonsuz bir yolculuğa çıkaran bir yol.",
      "aklıma sevmek geldiğinde, gözlerimin önüne sen geliyorsun. Günün her saati canım sevmek istiyor ve seni düşünüyor kalbim",
      "tak jileti dudağına şah damarımdan öp beni!",

      //Anılar anılar....
      "Cino tatlı Annenle Oyun Oynamak İstiyor bebegimm",
      "Cinax senden mesaj bekliyor ;)",
      "Cinax selam söyledi sana.",
      "Maddox yanına gelmek için uçak bileti almış benden duymuş olma.",
      "Stark seninle bu gece eglenmek istiyor",
      "Stark sunucuya annenide getirmeni istede",
      "Yavrum dikkatli sür senden mesaj bekliyorum",
      "Ahh o eski anılar...",
      "Hayalde olsa yaşanan sendin...",
      "Are you lost baby girl?",
      "Nein steffen nein",
      "eren benm za",
      "altı daşşaklarımın altı sana kahvaltı",
      "sevene can feda sevmeyene elveda"
    ];
    
    module.exports = async (message) => {
        if (message.channel.id === conf.chatChannel && !message.author.bot) {
        iltifatSayi++;
        if (iltifatSayi >= 50) {
          iltifatSayi = 0;
          message.reply({ content: iltifatlar.random()});
        };
      };
    }; 

module.exports.conf = {
  name: "messageCreate",
};
