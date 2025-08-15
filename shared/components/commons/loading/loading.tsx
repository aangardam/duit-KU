const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex space-x-2">
                <div className="w-5 h-5 bg-white rounded-full animate-bounce"></div>
                <div className="w-5 h-5 bg-white rounded-full animate-bounce"></div>
                <div className="w-5 h-5 bg-white rounded-full animate-bounce"></div>
            </div>
        </div>
    )
}

export default Loading