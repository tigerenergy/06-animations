한글 번역

소개
코드 끝에서 한 번 렌더링한 장면을 만들었습니다. 그것은 이미 좋은 진전이지만 대부분의 경우 창작물에 애니메이션 효과를 주고 싶을 것입니다.

Three.js를 사용할 때 애니메이션은 스톱 모션처럼 작동합니다. 개체를 이동하고 렌더링을 수행합니다. 그런 다음 개체를 조금 더 이동하고 다른 렌더링을 수행합니다. 등. 렌더링 간에 개체를 더 많이 이동할수록 더 빨리 움직이는 것처럼 보입니다.

보고 있는 화면이 특정 빈도로 실행됩니다. 우리는 그것을 프레임 속도라고 부릅니다. 프레임 속도는 주로 화면에 따라 다르지만 컴퓨터 자체에는 한계가 있습니다. 대부분의 화면은 초당 60프레임으로 실행됩니다. 수학을 하면 16ms마다 약 프레임을 의미합니다. 그러나 일부 화면은 훨씬 빠르게 실행될 수 있으며 컴퓨터가 처리하는 데 문제가 있으면 더 느리게 실행됩니다.

프레임 속도에 관계없이 각 프레임에서 개체를 이동하고 렌더링을 수행하는 함수를 실행하려고 합니다.

이를 수행하는 기본 JavaScript 방법은 window.requestAnimationFrame(...)메서드 를 사용하는 것입니다.

설정
이전과 마찬가지로 스타터에 있는 것은 장면 중앙에 있는 큐브뿐입니다.

requestAnimationFrame 사용
requestAnimationFrame 의 주요 목적은 각 프레임에서 코드를 실행하는 것이 아닙니다.

requestAnimationFrame다음 프레임에서 제공한 기능을 실행합니다 . 그러나 이 함수 requestAnimationFrame가 다음 프레임에서 동일한 함수를 실행하는 데에도 사용 되는 경우 각 프레임에서 함수가 영원히 실행되게 되며 이는 정확히 우리가 원하는 것입니다.

이름 tick이 지정된 함수를 만들고 이 함수를 한 번 호출합니다.
이 함수 window.requestAnimationFrame(...)에서 다음 프레임에서 동일한 함수를 호출 하는 데 사용 합니다.

/\*\*

- Animate
  \*/
  const tick = () =>
  {
  console.log('tick')

      window.requestAnimationFrame(tick)

  }

tick()
자바스크립트
그게 다야 무한 루프가 있습니다.

콘솔에서 볼 수 있듯이 'tick'각 프레임에서 호출됩니다. 프레임 속도가 높은 컴퓨터에서 이 코드를 테스트하면 'tick'가 더 높은 빈도로 나타납니다.

이제 renderer.render(...)해당 함수 내 에서 호출을 이동 하고 큐브를 늘릴 수 있습니다 rotation.

/\*\*

- Animate
  \*/
  const tick = () =>
  {
  // Update objects
  mesh.rotation.y += 0.01

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)

  }

tick()
자바스크립트
축하합니다. 이제 Three.js 애니메이션이 생겼습니다.

문제는 높은 프레임 속도의 컴퓨터에서 이 코드를 테스트하면 큐브가 더 빨리 회전하고 낮은 프레임 속도에서 테스트하면 큐브가 느리게 회전한다는 것입니다.

프레임 속도에 대한 적응
애니메이션을 프레임 속도에 맞게 조정하려면 마지막 틱 이후로 시간이 얼마나 흘렀는지 알아야 합니다.

먼저 시간을 측정하는 방법이 필요합니다. 기본 JavaScript Date.now()에서 현재 타임스탬프를 가져오는 데 사용할 수 있습니다 .

const time = Date.now()
자바스크립트
타임스탬프는 1970년 1월 1일(Unix의 경우 시간 시작) 이후 경과한 시간에 해당합니다. JavaScript에서 단위는 밀리초입니다.

이제 필요한 것은 이전 프레임의 타임스탬프에서 현재 타임스탬프를 빼서 deltaTime객체를 애니메이션할 때 호출할 수 있는 값 을 얻고 이 값을 사용하는 것입니다.

/\*\*

- Animate
  \*/
  let time = Date.now()

const tick = () =>
{
// Time
const currentTime = Date.now()
const deltaTime = currentTime - time
time = currentTime

    // Update objects
    mesh.rotation.y += 0.01 * deltaTime

    // ...

}

tick()
자바스크립트
16화면이 에서 실행 중인 경우 deltaTime이 주변에 있어야 하므로 큐브가 더 빨리 회전해야 60fps하므로 값을 곱하여 자유롭게 줄일 수 있습니다.

이제 마지막 프레임 이후에 소요된 시간을 기준으로 회전하므로 이 회전 속도는 프레임 속도에 관계없이 모든 화면과 모든 컴퓨터에서 동일합니다.

시계 사용
이 코드는 그렇게 복잡하지 않지만, Three.js 에는 시간 계산을 처리하는 Clock 이라는 내장 솔루션 이 있습니다.

Clock 변수 를 인스턴스화하고 와 같은 내장 메서드를 사용하기만 하면 getElapsedTime()됩니다. 이 메서드는 Clock 이 생성된 후 몇 초가 지났는지 반환합니다 .

이 값을 사용하여 개체를 회전할 수 있습니다.

/\*\*

- Animate
  \*/
  const clock = new THREE.Clock()

const tick = () =>
{
const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.y = elapsedTime

    // ...

}

tick()
자바스크립트
또한 position속성 으로 물건을 옮기는 데 사용할 수도 있습니다 . 와 결합하면 Math.sin(...)꽤 좋은 결과를 얻을 수 있습니다.

/\*\*

- Animate
  \*/
  const clock = new THREE.Clock()

const tick = () =>
{
const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.position.x = Math.cos(elapsedTime)
    mesh.position.y = Math.sin(elapsedTime)

    // ...

}

tick()
자바스크립트
그리고 분명히 이러한 기술을 사용 하여 카메라와 같은 모든 Object3D 를 애니메이션할 수 있습니다 .

/\*\*

- Animate
  \*/
  const clock = new THREE.Clock()

const tick = () =>
{
const elapsedTime = clock.getElapsedTime()

    // Update objects
    camera.position.x = Math.cos(elapsedTime)
    camera.position.y = Math.sin(elapsedTime)
    camera.lookAt(mesh.position)

    // ...

}

tick()
자바스크립트
사용 가능한 또 다른 방법은 getDelta(...)이지만 Clock 클래스 코드 에서 무슨 일이 일어나고 있는지 정확히 알지 못하면 사용해서는 안 됩니다. 이를 사용하면 애니메이션이 엉망이 되어 원치 않는 결과를 얻을 수 있습니다.

라이브러리 사용
다른 라이브러리를 사용해야 하는 매우 구체적인 방식으로 장면을 애니메이션하고 싶을 때가 있습니다. 수많은 애니메이션 라이브러리가 있지만 가장 유명한 라이브러리는 GSAP 입니다.

Webpack 프로젝트에 GSAP를 추가하기 위해 Node.js와 함께 제공되는 종속성 관리자를 사용할 수 있습니다 npm.

터미널에서(서버가 실행되고 있지 않거나 동일한 폴더의 다른 터미널 창을 사용하는 동안) 다음을 실행합니다. npm install --save gsap@3.5.1

--save인수는에 종속성을 절약 package.json우리가 할 경우 모듈이 페치 될 수 있습니다 npm install.

는 @3.5.1버전을 강제로. 수업을 작성할 때 사용한 버전이기 때문에 이 버전을 사용하지만 원하는 경우 을 제거하여 최신 버전을 사용해 볼 수 있습니다 @3.5.1.

이제 GSAP를 node_modules/폴더 에서 사용할 수 있으며 다음 에서 가져올 수 있습니다 script.js.

import './style.css'
import \* as THREE from 'three'
import gsap from 'gsap'

// ...
자바스크립트
GSAP를 사용하는 방법에는 여러 가지가 있으며 전체 과정을 GSAP에 할애할 수도 있지만 이것이 이 과정의 목표는 아닙니다. 우리는 간단히 테스트하기 위해 트윈을 만들 것입니다. GSAP 사용법을 이미 알고 있다면 Three.js에서도 동일하게 작동합니다.

이전 애니메이션과 관련된 코드에 주석을 달지만 tick렌더와 함께 함수를 유지합니다 . 그런 다음 다음을 사용하여 트윈(A에서 B로의 애니메이션)이라고 하는 것을 만들 수 있습니다 gsap.to(...).

/\*\*

- Animate
  \*/
  gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

const tick = () =>
{
// Render
renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

}

tick()
자바스크립트
GSAP에는 내장된 requestAnimationFrame가 있으므로 애니메이션을 직접 업데이트할 필요가 없지만 여전히 큐브가 움직이는 것을 보고 싶다면 각 프레임에서 장면의 렌더링을 계속 수행해야 합니다.

올바른 솔루션 선택
네이티브 JS와 애니메이션 라이브러리 중에서 선택하는 것은 달성하고자 하는 것이 중요합니다. 영원히 회전하는 회전 목마를 만들려면 라이브러리가 필요하지 않습니다. 그러나 예를 들어 검을 휘두르는 것과 같은 애니메이션을 만들고 싶다면 라이브러리를 사용하는 것이 좋습니다.
