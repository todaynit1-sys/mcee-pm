# 미세먼지 계절관리제 모션그래픽

미세먼지 계절관리제를 주제별 25초 모션그래픽으로 소개하는 홍보 사이트입니다.
체험형 콘텐츠 [pm-intro](https://pm-intro.vercel.app)의 내용을 영상으로 옮깁니다.

빌드 없이 그대로 올리는 정적 사이트입니다. 깃허브에 올리고 Vercel(또는 GitHub Pages)에서 저장소를 연결하면 됩니다. 프레임워크·빌드 명령은 비워 둡니다.

## 편 목록

| 번호 | 폴더 | 주제 | 상태 |
|---|---|---|---|
| 01 | `motion/season` | 미세먼지 계절관리제 | 완성 (25초) |
| 02 | `motion/car5` | 배출가스 5등급 차량 운행제한 | 완성 (25초) |
| 03 | `motion/alert` | 고농도 미세먼지 비상저감조치 | 완성 (25초) |
| 04 | `motion/action` | 고농도 미세먼지 7가지 대응요령 | 완성 (25초) |
| 05 | `motion/dust` | 미세먼지와 초미세먼지 | 완성 (25초) |

## 만드는 방식

- 음성 해설은 없습니다. 내용은 화면 속 글자와 화면 아래 자막으로 전달하고, 소리는 배경음과 효과음뿐입니다.
- 배경음·효과음은 음원 파일 없이 브라우저에서 바로 만들어집니다(`tools/engine/scripts/sound.js`). 브라우저 정책상 ‘소리 켜기’를 한 번 눌러야 납니다.
- 용어는 정부 발표 자료의 표현을 씁니다(초미세먼지, 배출가스 5등급 차량 운행제한, 비상저감조치, 발전·수송·산업·생활 부문 등).
- 화면 스타일은 `tools/engine/scripts/kit.js` 한 곳에 있습니다. 짙은 남색 바탕, 큰 글자, 강조색은 하늘색 하나, 먼지는 모래색입니다.

- 로고는 `assets/logo.png`(기후에너지환경부 수도권대기환경청) 한 파일을 첫 화면·영상 페이지·영상 화면 오른쪽 위에서 함께 씁니다. 글자가 어두운 색이라 흰 바탕판 위에 올립니다.
- 휴대폰처럼 좁은 화면에서는 영상 속 자막 대신 영상 아래에 큰 글씨 자막이 나옵니다. 영상이 화면 밖에 있을 때는 그리기를 멈춥니다.

## 폴더

```
index.html            첫 화면 (자동 생성 — 직접 고치지 않음)
<id>.html             모션그래픽 (자동 생성)
<id>-m.html           휴대폰 읽기 모드 (자동 생성)
<id>-poster.jpg       첫 화면에 쓰는 장면 그림 (자동 생성)
motion/<id>/
  story.json          제목·장면 이름(names)·자막(captions)·장면 길이(sceneSec)·poster(첫 화면에 쓸 장면 번호)
  scenes.js           장면 그림 (없으면 첫 화면에 '준비 중'으로 나옴)
  thumbs/<n>.jpg      읽기 모드용 장면 그림
tools/
  build-all.mjs       전체 빌드
  index.template.html 첫 화면 틀 (첫 화면을 고칠 때는 이 파일)
  serve.mjs           사이트 미리보기 서버
  engine/             모션 엔진: engine.js(재생기), kit.js(스타일·연출), sound.js(소리), assets(페이지 틀)
```

## 고치고 만드는 법

```bash
node tools/build-all.mjs
```

모든 편을 다시 만들고 `index.html`을 새로 씁니다. 한 편만 만들려면 `node tools/build-all.mjs season`.

```bash
node tools/serve.mjs
```

http://localhost:4195 에서 미리 봅니다.

### 새 편 만들기

1. `motion/<id>/story.json`의 자막을 확정합니다. `todo`가 적힌 편은 먼저 공식 자료와 대조합니다. 자막은 화면 아래 두 줄 안에 들어가게 짧게 씁니다.
2. `motion/season/scenes.js`를 본보기로 `motion/<id>/scenes.js`를 만듭니다. 장면 함수 개수는 `names` 개수와 같아야 합니다. 그릴 자리는 세로 140~590이고, 그 아래는 자막 자리입니다.
3. 자주 쓰는 연출(`CINE.K`): `chars`(글자가 하나씩 등장), `reveal`(줄 단위 등장), `burst`·`ring`·`sweep`(강조), `dust`·`haze`·`skyline`·`stars`·`sparks`(배경), `scale`(예보 등급 눈금), `icon`(선 그림 기호: truck·car·plant·factory·flame·mask·drop·house·siren·crane·school·lungs 등), `rows`(번호 목록), `title`(큰 두 줄 제목), `tag`·`road`, `cue(u, 시각, 'tick'|'pop'|'chime'|'rise'|'low')`(효과음).
4. 장면 그림을 저장합니다. `node tools/build-all.mjs <id>`로 한 번 만든 뒤 `node tools/serve.mjs`를 띄우고 브라우저에서 http://localhost:4195/__capture/<id> 를 엽니다. 그다음 `node tools/build-all.mjs <id>`를 한 번 더 돌립니다.

## 내용 기준

제8차 미세먼지 계절관리제(’26.12.1.~’27.3.31.)용입니다. 2026년 11월 12일 기준 제8차 세부 시행계획이 발표되기 전이라, 석탄발전 가동정지 기수·감축 사업장 수·농도 목표 같은 대책별 수치는 싣지 않았습니다. 시행계획이 발표되면 `motion/season/story.json`의 자막과 `scenes.js` 3번·4번 장면에 수치를 넣습니다. 농도(33 → 20㎍/㎥)는 제도 도입 초기와 제6차의 발표 수치입니다.

## 디자인 점검

첫 화면은 [unslop](https://github.com/heydamir/unslop)(Damir Sokolovsky, CC BY 4.0)의 점검 기준으로 다듬었습니다.
