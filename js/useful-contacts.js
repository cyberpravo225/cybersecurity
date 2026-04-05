const CONTACT_CATEGORIES = [
  {
    id: 'mvd-cybercrime',
    icon: '🛡️',
    title: 'МВД / киберпреступления',
    description: 'Для взлома аккаунтов, мошенничества, шантажа, кражи денег и иных преступлений в сети.',
    whenToContact: 'Если нужно официально зафиксировать факт преступления и начать проверку.',
    phoneLabel: 'Короткий номер МВД',
    phone: '102',
    websiteLabel: 'Официальный сайт МВД',
    website: 'https://mvd.gov.by'
  },
  {
    id: 'cert',
    icon: '🧪',
    title: 'CERT / реагирование на киберинциденты',
    description: 'Для фишинговых сайтов, вредоносных файлов, подозрительных доменов и технических инцидентов.',
    whenToContact: 'Когда нужно сообщить о фишинговом ресурсе или подозрительной киберактивности.',
    phoneLabel: 'Телефон',
    phone: '',
    websiteLabel: 'Национальный центр кибербезопасности (CERT.BY)',
    website: 'https://cert.by'
  },
  {
    id: 'personal-data',
    icon: '🔐',
    title: 'Защита персональных данных',
    description: 'Для утечки данных, незаконной обработки персональной информации и нарушений прав субъектов данных.',
    whenToContact: 'Если ваши персональные данные используются без согласия или произошла утечка.',
    phoneLabel: 'Телефон НЦЗПД',
    phone: '+375173677525',
    websiteLabel: 'Национальный центр защиты персональных данных',
    website: 'https://cpd.by'
  },
  {
    id: 'banks',
    icon: '💳',
    title: 'Банки',
    description: 'Для срочной блокировки карты, оспаривания операций, защиты интернет-банка и перевыпуска реквизитов.',
    whenToContact: 'Если списали деньги, вы сообщили коды/данные карты или подтвердили подозрительный платеж.',
    phoneLabel: 'Единый ориентир',
    phone: '147',
    websiteLabel: 'Список банков Республики Беларусь',
    website: 'https://www.nbrb.by/engl/finsector/banks/list'
  },
  {
    id: 'operators',
    icon: '📱',
    title: 'Мобильные операторы',
    description: 'Для риска SIM-swap, неожиданной потери связи, странных SMS и подозрительной переоформленной SIM.',
    whenToContact: 'Когда номер внезапно перестал работать, а в аккаунтах начались попытки входа.',
    phoneLabel: 'Проверка номера / SIM',
    phone: '909',
    websiteLabel: 'Контакты операторов связи Беларуси',
    website: 'https://belgie.by/en/catalog-services/mobile-operators/'
  },
  {
    id: 'online-checks',
    icon: '🔎',
    title: 'Проверка ссылок / файлов / сайтов',
    description: 'Для быстрой онлайн-проверки URL, файлов и репутации домена перед открытием или запуском.',
    whenToContact: 'Если получили подозрительную ссылку, вложение или видите незнакомый домен.',
    phoneLabel: 'Телефон',
    phone: '',
    websiteLabel: 'VirusTotal',
    website: 'https://www.virustotal.com'
  }
];

const EXTRA_CHECK_SERVICES = [
  { label: 'Google Safe Browsing', url: 'https://transparencyreport.google.com/safe-browsing/search' },
  { label: 'urlscan.io', url: 'https://urlscan.io' },
  { label: 'AbuseIPDB', url: 'https://www.abuseipdb.com' }
];

function sanitizeTel(phone) {
  return phone.replace(/\s+/g, '').replace(/[^+\d]/g, '');
}

function renderContactCard(contact) {
  const hasPhone = Boolean(contact.phone);
  const telValue = hasPhone ? sanitizeTel(contact.phone) : '';

  return `
    <article class="contact-card" role="listitem" aria-labelledby="${contact.id}-title">
      <header class="contact-card-head">
        <span class="contact-icon" aria-hidden="true">${contact.icon}</span>
        <h3 id="${contact.id}-title">${contact.title}</h3>
      </header>
      <p class="contact-description">${contact.description}</p>
      <p class="contact-when">${contact.whenToContact}</p>
      <dl class="contact-meta">
        <div>
          <dt>${contact.phoneLabel}</dt>
          <dd>${hasPhone ? `<a href="tel:${telValue}">${contact.phone}</a>` : 'Уточняйте на сайте'}</dd>
        </div>
        <div>
          <dt>Сайт</dt>
          <dd><a href="${contact.website}" target="_blank" rel="noopener noreferrer">${contact.websiteLabel}</a></dd>
        </div>
      </dl>
      <div class="contact-actions">
        ${hasPhone ? `<a class="btn secondary" href="tel:${telValue}">Позвонить</a>` : `<button class="btn secondary" type="button" disabled aria-disabled="true">Позвонить</button>`}
        <a class="btn primary" href="${contact.website}" target="_blank" rel="noopener noreferrer">Перейти</a>
      </div>
    </article>
  `;
}

function renderContactsPage() {
  const grid = document.getElementById('contacts-grid');
  if (!grid) return;

  grid.innerHTML = CONTACT_CATEGORIES.map(renderContactCard).join('');

  const checkCard = document.querySelector('#online-checks-title');
  if (!checkCard) return;

  const container = checkCard.closest('.contact-card');
  if (!container) return;

  const services = document.createElement('ul');
  services.className = 'extra-services';
  EXTRA_CHECK_SERVICES.forEach((service) => {
    const item = document.createElement('li');
    item.innerHTML = `<a href="${service.url}" target="_blank" rel="noopener noreferrer">${service.label}</a>`;
    services.appendChild(item);
  });

  container.appendChild(services);
}

document.addEventListener('DOMContentLoaded', renderContactsPage);
