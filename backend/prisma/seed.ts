import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── 1. SystemMetric (hanya 1 baris) ─────────────────────────────────────
  await prisma.systemMetric.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      manualSalesCount: 0,
      totalVisitors: 0,
    },
  });
  console.log('✅ SystemMetric seeded');

  // ─── 2. ReportTemplate (1 per elemen) ────────────────────────────────────
  const templates = [
    {
      id: 'API' as const,
      parfumName: 'Choleric',
      descriptionPlus:
        'Persona API/Choleric menggambarkan jiwa yang penuh semangat, berani, dan visioner. Kamu adalah pemimpin alami yang tidak takut mengambil risiko dan selalu terdepan dalam menginisiasi perubahan.',
      descriptionMinus:
        'Intensitasmu yang tinggi terkadang bisa menjadi tantangan. Kamu mungkin cenderung terburu-buru dalam mengambil keputusan dan kesulitan untuk bersabar dengan langkah yang lebih lambat.',
      backgroundImage: '',
      shopeeLink: null,
      tiktokLink: null,
      instagramLink: null,
    },
    {
      id: 'AIR' as const,
      parfumName: 'Melancholic',
      descriptionPlus:
        'Persona AIR/Melancholic menggambarkan jiwa yang dalam, puitis, dan penuh empati. Kamu memiliki kepekaan emosional yang tinggi dan kemampuan untuk memahami nuansa yang orang lain lewatkan.',
      descriptionMinus:
        'Kedalaman perasaanmu bisa membuatmu terlalu kritis terhadap diri sendiri dan mudah terbawa arus emosi negatif. Kamu mungkin perlu lebih banyak waktu untuk pulih dari kekecewaan.',
      backgroundImage: '',
      shopeeLink: null,
      tiktokLink: null,
      instagramLink: null,
    },
    {
      id: 'ANGIN' as const,
      parfumName: 'Sanguine',
      descriptionPlus:
        'Persona ANGIN/Sanguine menggambarkan jiwa yang ceria, energetik, dan menular semangatnya. Kamu adalah jiwa sosial yang membawa kebahagiaan ke mana pun pergi dan mudah beradaptasi dengan situasi baru.',
      descriptionMinus:
        'Energimu yang besar terkadang membuatmu sulit fokus pada satu hal dalam waktu lama. Kamu mungkin cenderung impulsif dan perlu lebih konsisten dalam menyelesaikan apa yang sudah dimulai.',
      backgroundImage: '',
      shopeeLink: null,
      tiktokLink: null,
      instagramLink: null,
    },
    {
      id: 'TANAH' as const,
      parfumName: 'Phlegmatic',
      descriptionPlus:
        'Persona TANAH/Phlegmatic menggambarkan jiwa yang tenang, stabil, dan dapat diandalkan. Kamu adalah jangkar yang membuat orang-orang di sekitarmu merasa aman dan kamu jarang kehilangan keseimbangan dalam situasi apapun.',
      descriptionMinus:
        'Stabilitasmu yang besar terkadang bisa berubah menjadi resistensi terhadap perubahan. Kamu mungkin perlu mendorong dirimu lebih keras untuk keluar dari zona nyaman dan mencoba hal-hal baru.',
      backgroundImage: '',
      shopeeLink: null,
      tiktokLink: null,
      instagramLink: null,
    },
  ];

  for (const template of templates) {
    await prisma.reportTemplate.upsert({
      where: { id: template.id },
      update: {},
      create: template,
    });
  }
  console.log('✅ ReportTemplates seeded (4 elemen)');

  // ─── 3. Admin User ────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123_ganti_ini!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@vundiego.com' },
    update: {},
    create: {
      email: 'admin@vundiego.com',
      name: 'Admin Vundiego',
      password: adminPassword,
      isAdmin: true,
    },
  });
  console.log('✅ Admin user seeded (email: admin@vundiego.com)');

  // ─── 4. Question Bank (7 soal per elemen = 28 total) ─────────────────────
  const questions = [
    // ── API (Choleric) ────────────────────────────────────────────
    {
      text: 'Ketika menghadapi masalah besar, apa yang pertama kali kamu lakukan?',
      element: 'API' as const,
      options: [
        { text: 'Langsung bertindak dan mencari solusi secepat mungkin', targetType: 'API' as const, order: 0 },
        { text: 'Menganalisis situasi secara mendalam sebelum bertindak', targetType: 'AIR' as const, order: 1 },
        { text: 'Berdiskusi dengan orang-orang terdekat untuk ide-ide baru', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Menunggu situasi menjadi lebih jelas sebelum melangkah', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Bagaimana caramu biasanya mengambil keputusan penting?',
      element: 'API' as const,
      options: [
        { text: 'Berdasarkan insting dan keyakinan diri', targetType: 'API' as const, order: 0 },
        { text: 'Setelah mempertimbangkan semua pro dan kontra secara detail', targetType: 'AIR' as const, order: 1 },
        { text: 'Mendengar pendapat banyak orang lalu memutuskan', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Mengikuti cara yang sudah terbukti berhasil sebelumnya', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Apa yang paling memotivasimu dalam bekerja atau belajar?',
      element: 'API' as const,
      options: [
        { text: 'Menjadi yang terbaik dan meraih pencapaian besar', targetType: 'API' as const, order: 0 },
        { text: 'Menghasilkan karya yang berkualitas dan bermakna', targetType: 'AIR' as const, order: 1 },
        { text: 'Berkolaborasi dan menciptakan sesuatu bersama orang lain', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Menciptakan stabilitas dan keamanan untuk masa depan', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Bagaimana reaksimu ketika rencanamu tidak berjalan sesuai harapan?',
      element: 'API' as const,
      options: [
        { text: 'Cepat beradaptasi dan langsung buat rencana alternatif', targetType: 'API' as const, order: 0 },
        { text: 'Mencari tahu penyebabnya secara menyeluruh', targetType: 'AIR' as const, order: 1 },
        { text: 'Mencari dukungan dan sudut pandang segar dari teman', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Tetap tenang dan menunggu momen yang tepat', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Saat berada di kelompok, peran apa yang paling sering kamu ambil?',
      element: 'API' as const,
      options: [
        { text: 'Pemimpin yang mengarahkan tim', targetType: 'API' as const, order: 0 },
        { text: 'Analis yang memastikan kualitas keputusan', targetType: 'AIR' as const, order: 1 },
        { text: 'Energizer yang menyemangati anggota tim', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Mediator yang menjaga harmoni kelompok', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Lingkungan kerja seperti apa yang paling cocok untukmu?',
      element: 'API' as const,
      options: [
        { text: 'Dinamis, kompetitif, dan penuh tantangan', targetType: 'API' as const, order: 0 },
        { text: 'Terstruktur, tenang, dan berorientasi kualitas', targetType: 'AIR' as const, order: 1 },
        { text: 'Sosial, kreatif, dan fleksibel', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Stabil, konsisten, dan suportif', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Bagaimana kamu merespons kritik dari orang lain?',
      element: 'API' as const,
      options: [
        { text: 'Menanggapinya langsung dan mempertahankan posisiku jika perlu', targetType: 'API' as const, order: 0 },
        { text: 'Menganalisis apakah kritik itu valid sebelum merespons', targetType: 'AIR' as const, order: 1 },
        { text: 'Mencoba melihatnya dari sisi positif dan berdiskusi', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Menerimanya dengan tenang dan merefleksikannya dalam diam', targetType: 'TANAH' as const, order: 3 },
      ],
    },

    // ── AIR (Melancholic) ──────────────────────────────────────────
    {
      text: 'Apa yang kamu rasakan ketika melihat keindahan alam atau karya seni?',
      element: 'AIR' as const,
      options: [
        { text: 'Terdorong untuk langsung menciptakan sesuatu', targetType: 'API' as const, order: 0 },
        { text: 'Tersentuh secara mendalam dan merenung lama', targetType: 'AIR' as const, order: 1 },
        { text: 'Ingin segera berbagi pengalaman ini dengan orang lain', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Menikmatinya dengan tenang dan damai dalam hati', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Ketika seseorang menceritakan masalahnya padamu, kamu cenderung...',
      element: 'AIR' as const,
      options: [
        { text: 'Langsung memberikan solusi dan langkah konkret', targetType: 'API' as const, order: 0 },
        { text: 'Mendengarkan dengan penuh perhatian dan memahami perasaannya', targetType: 'AIR' as const, order: 1 },
        { text: 'Menghibur dan mencoba membuatnya tersenyum kembali', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Menjadi pendengar yang sabar dan memberikan ruang untuk bercerita', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Bagaimana cara kamu mengekspresikan kreativitas?',
      element: 'AIR' as const,
      options: [
        { text: 'Melalui proyek besar yang berdampak nyata', targetType: 'API' as const, order: 0 },
        { text: 'Melalui tulisan, seni, atau musik yang penuh makna', targetType: 'AIR' as const, order: 1 },
        { text: 'Melalui performans, presentasi, atau kegiatan sosial', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Melalui kerajinan, berkebun, atau hal-hal praktis', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Seberapa detail kamu dalam merencanakan sesuatu?',
      element: 'AIR' as const,
      options: [
        { text: 'Garis besarnya saja — detail bisa disesuaikan nanti', targetType: 'API' as const, order: 0 },
        { text: 'Sangat detail — setiap kemungkinan sudah aku pertimbangkan', targetType: 'AIR' as const, order: 1 },
        { text: 'Cukup fleksibel — yang penting semua senang', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Moderat — cukup terencana tapi tidak kaku', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Apa yang paling kamu hargai dalam sebuah hubungan pertemanan?',
      element: 'AIR' as const,
      options: [
        { text: 'Saling mendukung untuk tumbuh dan berkembang', targetType: 'API' as const, order: 0 },
        { text: 'Kedalaman dan kejujuran dalam berbagi perasaan', targetType: 'AIR' as const, order: 1 },
        { text: 'Kesenangan, tawa, dan petualangan bersama', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Loyalitas, kepercayaan, dan konsistensi', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Bagaimana kamu biasanya mengatasi perasaan sedih atau kecewa?',
      element: 'AIR' as const,
      options: [
        { text: 'Langsung mencari distraksi atau aktivitas baru', targetType: 'API' as const, order: 0 },
        { text: 'Merenung sendirian dan mencoba memahami perasaanku', targetType: 'AIR' as const, order: 1 },
        { text: 'Menghabiskan waktu bersama teman-teman', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Beristirahat dan menunggu perasaan itu berlalu sendiri', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Apa jenis hiburan yang paling kamu nikmati di waktu senggang?',
      element: 'AIR' as const,
      options: [
        { text: 'Olahraga atau kegiatan yang memacu adrenalin', targetType: 'API' as const, order: 0 },
        { text: 'Membaca, menonton film bermakna, atau mendengar musik', targetType: 'AIR' as const, order: 1 },
        { text: 'Nongkrong, karaoke, atau aktivitas sosial lainnya', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Memasak, berkebun, atau aktivitas rumahan yang menenangkan', targetType: 'TANAH' as const, order: 3 },
      ],
    },

    // ── ANGIN (Sanguine) ───────────────────────────────────────────
    {
      text: 'Apa yang terjadi ketika kamu memasuki ruangan yang penuh orang asing?',
      element: 'ANGIN' as const,
      options: [
        { text: 'Langsung mengambil alih perhatian ruangan', targetType: 'API' as const, order: 0 },
        { text: 'Mengamati dari pinggir dan memilih siapa yang ingin kuajak bicara', targetType: 'AIR' as const, order: 1 },
        { text: 'Bersemangat dan langsung berkenalan dengan banyak orang', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Mencari seseorang yang kukenal atau sudut yang nyaman', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Bagaimana cara kamu mengisi ulang energimu setelah lelah?',
      element: 'ANGIN' as const,
      options: [
        { text: 'Dengan melakukan sesuatu yang produktif dan bermakna', targetType: 'API' as const, order: 0 },
        { text: 'Dengan waktu sendirian yang tenang dan reflektif', targetType: 'AIR' as const, order: 1 },
        { text: 'Dengan berkumpul bersama orang-orang yang menyenangkan', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Dengan beristirahat di rumah dan tidak melakukan apa-apa', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Dalam percakapan, kamu cenderung...',
      element: 'ANGIN' as const,
      options: [
        { text: 'Mendominasi pembicaraan dengan ide-ide kuatku', targetType: 'API' as const, order: 0 },
        { text: 'Menjadi pendengar yang baik dan mengajukan pertanyaan mendalam', targetType: 'AIR' as const, order: 1 },
        { text: 'Banyak bicara, bercerita, dan membuat orang tertawa', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Berbicara seperlunya dan lebih banyak mendengarkan', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Ketika ada proyek baru yang menarik, reaksi pertamamu adalah...',
      element: 'ANGIN' as const,
      options: [
        { text: 'Langsung memimpin dan menentukan arahnya', targetType: 'API' as const, order: 0 },
        { text: 'Memahami semua detail dan implikasinya terlebih dahulu', targetType: 'AIR' as const, order: 1 },
        { text: 'Sangat antusias dan langsung mengajak orang lain bergabung', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Mempertimbangkan apakah ini realistis dan berkelanjutan', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Bagaimana pendekatanmu terhadap peraturan atau prosedur?',
      element: 'ANGIN' as const,
      options: [
        { text: 'Peraturan ada untuk diubah jika tidak efisien', targetType: 'API' as const, order: 0 },
        { text: 'Peraturan penting — ada alasan di balik setiap aturan', targetType: 'AIR' as const, order: 1 },
        { text: 'Peraturan bisa fleksibel — yang penting situasinya kondusif', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Peraturan ada untuk diikuti demi ketertiban bersama', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Bagaimana gaya belajarmu yang paling efektif?',
      element: 'ANGIN' as const,
      options: [
        { text: 'Langsung praktik dan belajar dari pengalaman', targetType: 'API' as const, order: 0 },
        { text: 'Membaca dan memahami konsep secara mendalam', targetType: 'AIR' as const, order: 1 },
        { text: 'Diskusi kelompok dan belajar sambil berinteraksi', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Rutinitas terstruktur dengan latihan yang konsisten', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Seberapa sering kamu mencoba hal-hal baru?',
      element: 'ANGIN' as const,
      options: [
        { text: 'Selalu — aku selalu mencari peluang dan tantangan baru', targetType: 'API' as const, order: 0 },
        { text: 'Sesekali — setelah riset mendalam dan yakin itu baik', targetType: 'AIR' as const, order: 1 },
        { text: 'Sangat sering — hidup terlalu singkat untuk tidak mencoba', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Jarang — aku lebih suka yang sudah terbukti berhasil', targetType: 'TANAH' as const, order: 3 },
      ],
    },

    // ── TANAH (Phlegmatic) ─────────────────────────────────────────
    {
      text: 'Bagaimana reaksimu saat ada konflik di antara orang-orang sekitarmu?',
      element: 'TANAH' as const,
      options: [
        { text: 'Langsung turun tangan dan menyelesaikannya dengan tegas', targetType: 'API' as const, order: 0 },
        { text: 'Menganalisis akar masalah sebelum menawarkan solusi', targetType: 'AIR' as const, order: 1 },
        { text: 'Mencairkan suasana dengan humor atau topik baru', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Menjadi penengah yang netral dan menjaga perdamaian', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Bagaimana kamu menggambarkan ritme hidupmu sehari-hari?',
      element: 'TANAH' as const,
      options: [
        { text: 'Cepat, padat, dan selalu bergerak menuju target', targetType: 'API' as const, order: 0 },
        { text: 'Terencana dan terstruktur dengan baik', targetType: 'AIR' as const, order: 1 },
        { text: 'Spontan, penuh kejutan, dan mengalir begitu saja', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Tenang, konsisten, dan tidak terburu-buru', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Apa yang membuat seseorang layak untuk kamu percayai sepenuhnya?',
      element: 'TANAH' as const,
      options: [
        { text: 'Kemampuan dan track record yang terbukti', targetType: 'API' as const, order: 0 },
        { text: 'Kejujuran dan integritas yang konsisten', targetType: 'AIR' as const, order: 1 },
        { text: 'Keterbukaan dan ketulusan dalam berbagi', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Kesetiaan dan kehandalan selama bertahun-tahun', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Ketika menghadapi perubahan besar dalam hidupmu, kamu biasanya...',
      element: 'TANAH' as const,
      options: [
        { text: 'Menyambutnya sebagai peluang dan langsung beradaptasi', targetType: 'API' as const, order: 0 },
        { text: 'Mempersiapkan diri dengan sangat matang sebelumnya', targetType: 'AIR' as const, order: 1 },
        { text: 'Excited dengan hal baru dan langsung menceritakannya ke semua orang', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Membutuhkan waktu untuk menyesuaikan diri secara perlahan', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Apa yang paling penting bagimu dalam sebuah keluarga atau komunitas?',
      element: 'TANAH' as const,
      options: [
        { text: 'Setiap orang bertumbuh dan mencapai potensi terbaiknya', targetType: 'API' as const, order: 0 },
        { text: 'Adanya nilai dan prinsip bersama yang dijunjung tinggi', targetType: 'AIR' as const, order: 1 },
        { text: 'Kebersamaan, kesenangan, dan momen-momen berharga', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Keamanan, keharmonisan, dan saling mendukung satu sama lain', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Bagaimana kamu mendeskripsikan dirimu dalam satu kata?',
      element: 'TANAH' as const,
      options: [
        { text: 'Ambisius', targetType: 'API' as const, order: 0 },
        { text: 'Analitis', targetType: 'AIR' as const, order: 1 },
        { text: 'Ekspresif', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Dapat diandalkan', targetType: 'TANAH' as const, order: 3 },
      ],
    },
    {
      text: 'Bagaimana sikapmu terhadap komitmen jangka panjang?',
      element: 'TANAH' as const,
      options: [
        { text: 'Siap berkomitmen penuh jika itu menuju tujuan besar', targetType: 'API' as const, order: 0 },
        { text: 'Berkomitmen hanya setelah benar-benar yakin dan siap', targetType: 'AIR' as const, order: 1 },
        { text: 'Semangat di awal tapi perlu usaha ekstra untuk bertahan', targetType: 'ANGIN' as const, order: 2 },
        { text: 'Sekali berkomitmen, aku akan setia sampai akhir', targetType: 'TANAH' as const, order: 3 },
      ],
    },
  ];

  // Upsert questions ke database
  let questionCount = 0;
  for (const q of questions) {
    // Cek apakah soal dengan teks yang sama sudah ada
    const existing = await prisma.question.findFirst({ where: { text: q.text } });
    if (!existing) {
      await prisma.question.create({
        data: {
          text: q.text,
          element: q.element,
          isActive: true,
          options: {
            create: q.options.map((opt) => ({
              text: opt.text,
              targetType: opt.targetType,
              order: opt.order,
            })),
          },
        },
      });
      questionCount++;
    }
  }
  console.log(`✅ Questions seeded: ${questionCount} soal baru (${questions.length} total dalam seed)`);

  console.log('\n🎉 Database seeding completed!');
  console.log('⚠️  Jangan lupa ganti password admin sebelum production!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
