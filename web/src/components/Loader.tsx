import styled from 'styled-components'

const Wrapper = styled.div`
    display: inline-block;
    .divs-container {
        display: flex;
        justify-content: center;
        align-items: center;
        // height: 20px;
        // width: 50px;

        .div {
            width: 3px;
            height: 10px;
            background: rgb(255,255,255, 0.8);
            margin: 5px;
            transition: transform 0.3s;
        }

        .div1 {
            animation: moveUpAndDown 0.9s infinite 0.1s;
        }

        .div2 {
            animation: moveUpAndDown 0.9s infinite 0.2s;
        }

        .div3 {
            animation: moveUpAndDown 0.9s infinite 0.3s;
        }
    }

    @keyframes moveUpAndDown {
        0% {
        transform: translateY(0px) scaleY(1);
        }
        50% {
        transform: translateY(0px) scaleY(0.3);
        }
        100% {
        transform: translateY(0px) scaleY(1);
        }
  }
`

interface Props {
  type?: 'two'
}

export default function Loader({ type }: Props): React.JSX.Element {
  if (type === 'two') {
    return (
      <Wrapper className="loader">
        <div className="divs-container">
          <div className="div div1" />
          <div className="div div2" />
        </div>
      </Wrapper>
    )
  }

  return (
    <Wrapper className="loader">
      <div className="divs-container">
        <div className="div div1" />
        <div className="div div2" />
        <div className="div div3" />
      </div>
    </Wrapper>
  )
}
