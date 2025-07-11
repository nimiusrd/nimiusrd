import fs from 'fs';
import Handlebars from 'handlebars';

// Handlebarsヘルパー関数を登録
Handlebars.registerHelper('techIcon', function(icon, name) {
  // フルURLかどうかを判定
  const iconUrl = icon.startsWith('http') ? icon : `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}`;
  return new Handlebars.SafeString(
    `<img src="${iconUrl}" width="40" height="40" alt="${name}" />`
  );
});

Handlebars.registerHelper('filterByCategory', function(items, category, options) {
  const filtered = items.filter(item => item.category === category);
  return filtered.map(item => options.fn(item)).join('');
});

Handlebars.registerHelper('formatDate', function(date) {
  return date.toLocaleDateString('ja-JP');
});

Handlebars.registerHelper('formatISODate', function(date) {
  return date.toISOString();
});

try {
  // 設定ファイルを読み込み
  const configPath = '.github/config/readme-data.json';
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // テンプレートファイルを読み込み
  const templatePath = 'README.template.hbs';
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  
  // Handlebarsテンプレートをコンパイル
  const template = Handlebars.compile(templateSource);
  
  // テンプレートデータを準備
  const templateData = {
    ...configData,
    currentYear: new Date().getFullYear(),
    currentDate: new Date(),
    generatedAt: new Date().toISOString(),
    techCount: configData.technologies.length
  };
  
  // テンプレートを実行してHTMLを生成
  const content = template(templateData);
  
  // README.mdファイルを出力
  fs.writeFileSync('README.md', content);
  
  console.log('✅ README.md generated successfully with Handlebars');
  console.log(`🗓️ Generated on: ${templateData.currentDate.toLocaleDateString('ja-JP')}`);
  console.log(`🛠️ Tech icons: ${templateData.techCount} items`);
  console.log(`📂 Config loaded from: ${configPath}`);
  
} catch (error) {
  console.error('❌ Error generating README:', error.message);
  process.exit(1);
}