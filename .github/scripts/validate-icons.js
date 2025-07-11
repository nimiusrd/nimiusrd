import fs from 'fs';
import https from 'https';
import http from 'http';
import { URL } from 'url';


/**
 * HTTPリクエストでURLの有効性を確認
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const request = protocol.request(url, { method: 'HEAD' }, (response) => {
      resolve({
        url,
        status: response.statusCode,
        valid: response.statusCode >= 200 && response.statusCode < 300
      });
    });
    
    request.on('error', (error) => {
      resolve({
        url,
        status: 0,
        valid: false,
        error: error.message
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        url,
        status: 0,
        valid: false,
        error: 'Request timeout'
      });
    });
    
    request.end();
  });
}

/**
 * 複数のURLを並行して検証
 */
async function validateIconUrls(technologies) {
  const iconUrls = technologies.map(tech => ({
    name: tech.name,
    category: tech.category,
    url: tech.icon
  }));
  
  console.log(`🔍 Validating ${iconUrls.length} icon URLs...`);
  
  const results = await Promise.all(
    iconUrls.map(async (iconData) => {
      const result = await checkUrl(iconData.url);
      return {
        ...iconData,
        ...result
      };
    })
  );
  
  return results;
}

/**
 * 結果を分析して報告
 */
function analyzeResults(results) {
  const validIcons = results.filter(r => r.valid);
  const invalidIcons = results.filter(r => !r.valid);
  
  console.log('\n📊 検証結果:');
  console.log(`✅ 有効なアイコン: ${validIcons.length}/${results.length}`);
  console.log(`❌ 無効なアイコン: ${invalidIcons.length}/${results.length}`);
  
  if (invalidIcons.length > 0) {
    console.log('\n❌ 無効なアイコンの詳細:');
    invalidIcons.forEach(icon => {
      console.log(`  - ${icon.name} (${icon.category})`);
      console.log(`    URL: ${icon.url}`);
      console.log(`    ステータス: ${icon.status}`);
      if (icon.error) {
        console.log(`    エラー: ${icon.error}`);
      }
      console.log('');
    });
  }
  
  if (validIcons.length > 0) {
    console.log('\n✅ 有効なアイコン:');
    validIcons.forEach(icon => {
      console.log(`  - ${icon.name} (${icon.category}) - ${icon.status}`);
    });
  }
  
  return {
    total: results.length,
    valid: validIcons.length,
    invalid: invalidIcons.length,
    invalidIcons
  };
}

/**
 * 無効なアイコンの修正候補を提案
 */
function suggestAlternatives(invalidIcons) {
  const suggestions = {
    'rails': ['rubyonrails', 'ruby'],
    'fastapi': ['python', 'python'],
    'flask': ['python', 'python']
  };
  
  console.log('\n💡 修正候補:');
  invalidIcons.forEach(icon => {
    const iconName = icon.url.split('/').slice(-2, -1)[0];
    if (suggestions[iconName]) {
      console.log(`  - ${icon.name}: ${suggestions[iconName].join('/')}-original.svg を試してください`);
    }
  });
}

/**
 * メイン処理
 */
async function main() {
  try {
    // 設定ファイルを読み込み
    const configPath = '.github/config/readme-data.json';
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // アイコンURLを検証
    const results = await validateIconUrls(configData.technologies);
    
    // 結果を分析
    const summary = analyzeResults(results);
    
    // 修正候補を提案
    if (summary.invalid > 0) {
      suggestAlternatives(summary.invalidIcons);
    }
    
    // 結果をJSONファイルに保存
    const reportPath = '.github/reports/icon-validation-report.json';
    fs.mkdirSync('.github/reports', { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary,
      results
    }, null, 2));
    
    console.log(`\n📄 詳細レポートを保存しました: ${reportPath}`);
    
    // 無効なアイコンがある場合は終了コード1で終了
    if (summary.invalid > 0) {
      console.log('\n⚠️  無効なアイコンが見つかりました。修正してください。');
      process.exit(1);
    } else {
      console.log('\n🎉 すべてのアイコンが有効です！');
    }
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();