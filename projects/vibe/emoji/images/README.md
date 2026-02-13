# 이미지 사용 가이드

이 폴더에 원하는 이미지 파일을 넣으세요.

## 📝 사용 방법

1. 이 폴더(`images/`)에 이미지 파일 추가
2. `config.js` 파일 열기
3. `IMAGE_MODE`를 `'image'`로 변경
4. `IMAGE_LIST` 배열에 파일명 추가

## ✅ 예시

```javascript
// config.js
const IMAGE_MODE = 'image'; // 'emoji'에서 'image'로 변경

const IMAGE_LIST = [
  'images/star.png',
  'images/heart.png',
  'images/rocket.png',
];
```

## 💡 권장 사항

- **포맷**: PNG (투명 배경 권장), JPG, GIF, WebP
- **크기**: 100x100px ~ 200x200px
- **모양**: 정사각형 권장
- **배경**: 투명 배경(PNG)을 사용하면 더 예쁩니다
