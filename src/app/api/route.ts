export async function GET(request: Request) {
    // const res = await fetch("https://api.github.com/users/nikhilsharma-07");
    // const data = await res.json();
    return Response.json({
        message: "Hello from the server!",
    })
}