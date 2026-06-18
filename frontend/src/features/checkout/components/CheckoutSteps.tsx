type CheckoutStepsProps = {
  steps: string[]
  currentStep: number
  onSelectStep: (step: number) => void
}

export function CheckoutSteps({ steps, currentStep, onSelectStep }: CheckoutStepsProps) {
  return (
    <div className="checkout-steps">
      {steps.map((item, index) => (
        <button
          className={`checkout-step ${index <= currentStep ? 'active' : ''}`}
          disabled={index > currentStep}
          key={item}
          onClick={() => onSelectStep(index)}
        >
          <span>{index + 1}</span>
          {item}
        </button>
      ))}
    </div>
  )
}
