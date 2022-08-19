// import { useEffect, useState } from "react";

// export function Async() {
//   const [isButtonVisible, setIsButtonVisible] = useState(false);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsButtonVisible(true);
//     }, 1000);
//   }, []);
  
//   return(
//     <div>
//       <div>Hello World</div>
//       {isButtonVisible && <button>Button</button>}
//     </div>
//   )
// }

/* BOTÃO INVISÍVEL */
import { useEffect, useState } from "react";

export function Async() {
  const [isButtonInvisible, setButtonInvisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setButtonInvisible(true);
    }, 1000);
  }, []);
  
  return(
    <div>
      <div>Hello World</div>
      {!isButtonInvisible && <button>Button</button>}
    </div>
  )
}