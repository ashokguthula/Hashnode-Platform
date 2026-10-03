function LoadingSpinner({ message = "Loading..." }) {
    return (
        <div className="loading-spinner">
            <p>{message}</p>
        </div>
    );
}

export default LoadingSpinner;