// import
const movieListContainer = document.getElementById("movie-list");
const movieInput = document.getElementById("movie-name");
const main = document.getElementById("main");
const loader = document.getElementById("loader");
const loader1 = document.getElementById("loader-1");
let movieValue = movieInput.value;
let API_KEY = "48b2dc2";

// Get the data from the OMDb API
async function getMovies(searchTerm) {
  loader.classList.remove("hidden");
  movieListContainer.classList.add("hidden");
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=${API_KEY}`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (!res.ok) {
    throw Error("Error in fetching Data");
  }
  if (data.Response === "True") {
    displayMatchingMovies(data.Search);
  } else {
    console.log("Error in fetching movie list");
  }
  loader.classList.add("hidden");
  movieListContainer.classList.remove("hidden");
}
// Event Listeners
movieInput.addEventListener("input", () => {
  findMovies();
});

// Callback Functions used in Event Listeners
const findMovies = () => {
  movieValue = movieInput.value.trim();
  if (movieValue === "" || movieValue.length < 3) {
    movieListContainer.innerHTML = "";
    loader.classList.add("hidden");

    return;
  }
  getMovies(movieValue);
};

function displayMatchingMovies(movieList) {
  if (movieList.length === 0) {
    movieListContainer.innerHTML = "No matching movies found.";
    return;
  }
  movieListContainer.innerHTML = `
    <ul class="w-full py-3 text-left flex flex-col gap-1 h-60 overflow-scroll">
        ${movieList
          .map((item) => {
            return `<li onclick="getMovieDetails(this)" data-id="${item.imdbID}" class="movieItem flex gap-4 bg-slate-900 py-2 px-3 hover:bg-slate-950 duration-300 cursor-pointer items-center ">
              <img src="${item.Poster}" class="w-8">
              <span class="text-lg">${item.Title}</span>
              </li>`;
          })
          .join("")}
    </ul>
  `;
  // getMovieDetails();
}

async function getMovieDetails(element) {
  loader1.classList.remove("hidden");
  const result = await fetch(
    `https://www.omdbapi.com/?i=${element.dataset.id}&page=1&apikey=${API_KEY}`
  );
  const movie = await result.json();
  movieListContainer.innerHTML = "";
  movieInput.value = "";
  let rottenTomatoRating = "N/A";
  for (let i = 0; i < movie.Ratings.length; i++) {
    if (movie.Ratings[i].Source === "Rotten Tomatoes") {
      rottenTomatoRating = movie.Ratings[i].Value;
    }
  }

  main.innerHTML = `<div class="movie-details w-full flex gap-2 px-4 py-2 mx-auto items-center justify-center">
          <div class="movie-image w-[40%] flex items-center justify-center">
            <img
              src="${
                movie.Poster === "N/A" ? "image_not_found.png" : movie.Poster
              }"
              alt=""
              class="w-[65%]"
            />
          </div>
          <div class="movie-details flex flex-col w-1/2 items-start gap-4">
            <div class="movie-name text-4xl font-bold">${movie.Title}</div>
            <div class="movie-data">
              <span class="movie-year text-base text-gray-400">${
                movie.Year ? movie.Year : ""
              }</span> •
              <span class="movie-rated text-base text-gray-300">${
                movie.Rated ? movie.Rated : ""
              }</span> •
              <span class="movie-time text-base text-gray-400">${
                movie.Runtime ? movie.Runtime : ""
              }</span>
            </div>
            <div
              class="movie-rating flex gap-2 items-center justify-center w-full"
            >
              <div
                class="movie-rating-imdb flex flex-col items-center justify-center px-9 border-r-2 border-golden"
              >
                <div>${movie.imdbRating ? movie.imdbRating : "N/A"}/10</div>
                <div class="my-2">
                  <svg
                    id="home_img"
                    class="ipc-logo"
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="32"
                    viewBox="0 0 64 32"
                    version="1.1"
                  >
                    <g fill="#F5C518">
                      <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        rx="4"
                      ></rect>
                    </g>
                    <g
                      transform="translate(8.000000, 7.000000)"
                      fill="#000000"
                      fill-rule="nonzero"
                    >
                      <polygon points="0 18 5 18 5 0 0 0"></polygon>
                      <path
                        d="M15.6725178,0 L14.5534833,8.40846934 L13.8582008,3.83502426 C13.65661,2.37009263 13.4632474,1.09175121 13.278113,0 L7,0 L7,18 L11.2416347,18 L11.2580911,6.11380679 L13.0436094,18 L16.0633571,18 L17.7583653,5.8517865 L17.7707076,18 L22,18 L22,0 L15.6725178,0 Z"
                      ></path>
                      <path
                        d="M24,18 L24,0 L31.8045586,0 C33.5693522,0 35,1.41994415 35,3.17660424 L35,14.8233958 C35,16.5777858 33.5716617,18 31.8045586,18 L24,18 Z M29.8322479,3.2395236 C29.6339219,3.13233348 29.2545158,3.08072342 28.7026524,3.08072342 L28.7026524,14.8914865 C29.4312846,14.8914865 29.8796736,14.7604764 30.0478195,14.4865461 C30.2159654,14.2165858 30.3021941,13.486105 30.3021941,12.2871637 L30.3021941,5.3078959 C30.3021941,4.49404499 30.272014,3.97397442 30.2159654,3.74371416 C30.1599168,3.5134539 30.0348852,3.34671372 29.8322479,3.2395236 Z"
                      ></path>
                      <path
                        d="M44.4299079,4.50685823 L44.749518,4.50685823 C46.5447098,4.50685823 48,5.91267586 48,7.64486762 L48,14.8619906 C48,16.5950653 46.5451816,18 44.749518,18 L44.4299079,18 C43.3314617,18 42.3602746,17.4736618 41.7718697,16.6682739 L41.4838962,17.7687785 L37,17.7687785 L37,0 L41.7843263,0 L41.7843263,5.78053556 C42.4024982,5.01015739 43.3551514,4.50685823 44.4299079,4.50685823 Z M43.4055679,13.2842155 L43.4055679,9.01907814 C43.4055679,8.31433946 43.3603268,7.85185468 43.2660746,7.63896485 C43.1718224,7.42607505 42.7955881,7.2893916 42.5316822,7.2893916 C42.267776,7.2893916 41.8607934,7.40047379 41.7816216,7.58767002 L41.7816216,9.01907814 L41.7816216,13.4207851 L41.7816216,14.8074788 C41.8721037,15.0130276 42.2602358,15.1274059 42.5316822,15.1274059 C42.8031285,15.1274059 43.1982131,15.0166981 43.281155,14.8074788 C43.3640968,14.5982595 43.4055679,14.0880581 43.4055679,13.2842155 Z"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                class="movie-rating-rotten-tomatoes flex flex-col items-center justify-center px-8"
              >
                <div>${rottenTomatoRating}</div>
                <div class="py-2">
                  <svg
                    xmlns:dc="http://purl.org/dc/elements/1.1/"
                    xmlns:cc="http://creativecommons.org/ns#"
                    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                    xmlns:svg="http://www.w3.org/2000/svg"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                    width="100"
                    viewBox="0 0 158.75 45.245838"
                    version="1.1"
                    id="svg1209"
                    inkscape:version="1.0.2-2 (e86c870879, 2021-01-15)"
                    sodipodi:docname="rottentomatoes.svg"
                  >
                    <defs id="defs1203" />
                    <sodipodi:namedview
                      id="base"
                      pagecolor="#ffffff"
                      bordercolor="#666666"
                      borderopacity="1.0"
                      inkscape:pageopacity="0.0"
                      inkscape:pageshadow="2"
                      inkscape:zoom="0.35"
                      inkscape:cx="112.32183"
                      inkscape:cy="139.09794"
                      inkscape:document-units="mm"
                      inkscape:current-layer="layer1"
                      inkscape:document-rotation="0"
                      showgrid="false"
                      fit-margin-top="0"
                      fit-margin-left="0"
                      fit-margin-right="0"
                      fit-margin-bottom="0"
                      units="px"
                      inkscape:window-width="1920"
                      inkscape:window-height="1051"
                      inkscape:window-x="-9"
                      inkscape:window-y="-9"
                      inkscape:window-maximized="1"
                    />
                    <metadata id="metadata1206">
                      <rdf:RDF>
                        <cc:Work rdf:about="">
                          <dc:format>image/svg+xml</dc:format>
                          <dc:type
                            rdf:resource="http://purl.org/dc/dcmitype/StillImage"
                          />
                          <dc:title></dc:title>
                        </cc:Work>
                      </rdf:RDF>
                    </metadata>
                    <g
                      inkscape:label="Layer 1"
                      inkscape:groupmode="layer"
                      id="layer1"
                      transform="translate(-14.999447,-87.294912)"
                    >
                      <path
                        d="m 137.77191,120.88341 c 1.30249,5.39569 -2.60261,9.92139 -7.69162,11.15035 -5.08913,1.22814 -10.74964,-0.98904 -12.05225,-6.38509 -0.91908,-3.80775 0.46251,-6.89446 3.07936,-8.91241 0.25023,-0.20398 0.56331,-0.40202 0.77321,-0.47437 -1.30818,0.10673 -2.09895,0.0475 -2.89612,0.31546 -0.0831,0.0237 -0.16722,-0.0593 -0.12334,-0.14587 0.85267,-1.6157 2.81027,-2.40397 4.19708,-1.86925 -0.94161,-0.82302 -1.68199,-1.47908 -1.68199,-1.47908 l 1.29111,-1.06732 c 0,0 0.82659,1.21996 1.42761,2.10797 0.78983,-1.76618 2.74979,-2.26166 3.78651,-1.29027 0.0593,0.0593 0.0237,0.16128 -0.0593,0.17432 -0.68664,0.10674 -0.93806,0.81472 -0.88351,1.29265 l 0.59533,-0.0712 c 4.87235,-0.62379 9.06444,1.80283 10.23613,6.65892 z M 61.706561,101.56316 c -0.942801,-0.38068 -1.49959,-1.19374 -1.063772,-2.066227 0.3285,-0.654621 1.290282,-0.920271 2.025316,-0.633281 0.881131,0.342733 1.021073,1.255888 1.472551,1.636088 0.38898,0.32732 0.920271,0.36764 1.268218,0.14351 0.257345,-0.16603 0.341544,-0.53011 0.245491,-0.86335 -0.128078,-0.442355 -0.469622,-0.717481 -0.80168,-0.989059 -0.591772,-0.480296 -1.426903,-0.894184 -0.921461,-2.206871 0.413888,-1.075626 1.628029,-1.113578 1.628029,-1.113578 0.482665,-0.05927 0.914345,0.09485 1.266563,0.405583 0.470801,0.419815 0.562116,0.983121 0.482665,1.582247 -0.07117,0.546714 -0.265651,1.02701 -0.366452,1.568976 -0.118592,0.629724 0.219393,1.264182 0.859792,1.288612 0.84082,0.0356 1.093417,-0.614306 1.197063,-1.024626 0.150616,-0.600078 0.34866,-1.157457 0.904859,-1.507658 0.799311,-0.504015 1.909206,-0.393728 2.424371,0.57398 0.406772,0.766107 0.276316,1.820034 -0.34866,2.395674 -0.279873,0.25852 -0.617859,0.34865 -0.981942,0.35221 -0.522985,0.004 -1.04598,-0.009 -1.53149,0.23481 -0.330868,0.16722 -0.474369,0.43761 -0.474369,0.80168 0,0.35459 0.185,0.58585 0.483855,0.73645 0.563305,0.28345 1.184733,0.34155 1.793106,0.44829 0.882321,0.15416 1.658265,0.46488 2.156114,1.28364 l 0.0119,0.0237 c 0.571611,0.96889 -0.02369,2.36472 -1.15034,2.42354 -2.502054,0.13163 -3.013061,-2.73176 -3.995127,-2.71136 -0.418626,0.008 -0.748305,0.4459 -0.603626,0.95585 0.08306,0.27987 0.301224,0.69138 0.439976,0.94636 0.490971,0.90011 -0.234816,1.9181 -1.083932,2.00397 -1.411243,0.14349 -1.999932,-0.67598 -1.96317,-1.51347 0.03558,-0.94044 0.838452,-1.90186 0.02369,-2.31065 -0.857412,-0.4293 -1.554381,1.24771 -2.375269,1.62139 -0.742388,0.33799 -1.773536,0.0712 -2.139874,-0.74831 -0.257344,-0.57992 -0.211087,-1.69574 0.935695,-2.1209 0.716291,-0.26565 2.311468,0.34748 2.393298,-0.43049 0.09485,-0.89536 -1.67618,-0.97126 -2.209364,-1.18592 z m 5.328563,9.81097 c 5.550335,0 9.864228,-3.25261 9.864228,-9.46018 0,-5.093157 -2.856879,-8.197058 -6.955764,-9.147099 -2.379428,-0.467253 -3.978753,-0.391349 -6.167605,0.08306 -3.938546,1.043602 -6.864914,4.113595 -6.864914,9.060409 0,6.20756 4.574672,9.46018 10.124055,9.46018 z m 106.714316,14.52156 c 0,1.95582 -0.78506,3.57803 -2.33198,4.82325 -1.46354,1.20691 -3.38745,1.82181 -5.71458,1.82181 -3.0171,0 -5.46352,-0.63328 -7.6532,-2.06788 l -0.41389,-0.29174 2.85534,-4.71142 c 3.2787,2.10227 4.97291,1.78742 5.61887,1.73761 1.4186,-0.10674 1.5723,-1.67867 0.39848,-1.65092 -0.9013,0.0237 -2.68267,0.20635 -5.32371,-1.02344 -1.84706,-1.13018 -3.05148,-2.44726 -3.05148,-4.61975 0,-1.87564 0.77914,-3.41116 2.31645,-4.56412 1.47741,-1.10764 2.89031,-1.72112 4.99746,-1.81848 2.73176,-0.12571 4.71046,0.46843 7.16342,1.73096 l 0.51705,0.34392 -2.60511,4.29183 c -2.85354,-1.14322 -4.33262,-1.45453 -5.36781,-1.25671 -1.2126,0.23006 -1.03768,1.40721 -0.14349,1.52662 0.89417,0.1186 2.32297,-0.26564 5.01382,0.68903 2.33613,0.93331 3.72366,2.45129 3.72366,5.04003 z m -43.32085,-14.98193 h -7.1831 v -17.9523 h 7.11195 v 2.080107 c 0.47792,-1.086301 2.57972,-2.587918 4.65733,-2.587918 4.2584,0 6.70067,2.947605 6.70067,8.086651 v 10.37346 h -7.17492 v -9.77908 c 0,-1.506938 -0.65107,-2.27138 -1.93376,-2.27138 -1.34495,0 -2.17817,0.566874 -2.17817,3.38911 z m -35.423959,14.11029 c -0.544335,0.61312 -1.317197,0.93687 -2.233786,0.93687 -1.480029,0 -2.979619,-1.02344 -2.979619,-2.9795 0,-0.77678 0.264461,-1.50125 0.745937,-2.0425 0.544334,-0.61193 1.317206,-0.9357 2.23392,-0.9357 1.480733,0 2.979495,1.02345 2.979495,2.97867 0,0.77678 -0.264461,1.50197 -0.745947,2.04251 z m 0.849127,-8.93364 -0.449472,-0.49097 c -1.246868,-1.36144 -2.813465,-2.08093 -4.530555,-2.08093 -1.211772,0 -2.488172,0.36764 -3.692476,1.06258 -2.683609,1.54786 -4.286968,4.68189 -4.288633,8.38337 -0.0021,3.71785 1.60099,6.86587 4.288633,8.41942 1.204304,0.69614 2.488058,1.06496 3.712874,1.06496 1.712228,0 3.271471,-0.70207 4.511823,-2.02946 l 0.448271,-0.4803 v 2.01795 h 6.898607 V 114.02668 H 95.854223 Z M 79.415753,99.117562 h -1.857746 v -6.18883 h 1.857746 v -4.894514 h 7.118463 v 4.894514 h 2.806949 v 6.18883 h -2.806949 v 4.498648 c 0,0.87284 0.372379,1.24617 1.246879,1.24617 h 2.254308 v 6.15693 l -0.413889,0.0119 c -0.724586,0.0356 -1.692533,0.0712 -2.698193,0.0712 -4.771071,0 -7.507692,-2.39413 -7.507692,-7.02858 z m 21.527127,5.758688 h 2.25514 v 6.1561 l -0.41507,0.0237 c -0.72341,0.0356 -1.69171,0.0712 -2.69832,0.0712 -4.770946,0 -7.506853,-2.39329 -7.506853,-7.02857 V 99.135447 H 90.71909 v -6.18883 h 1.858449 v -4.894401 h 7.11776 v 4.894401 h 2.807781 v 6.18883 h -2.807781 v 4.498773 c 0,0.87403 0.372381,1.24688 1.246871,1.24688 z m -66.76704,10.31227 h -6.116847 v 16.79045 h -6.943497 v -16.79045 h -6.116049 v -6.8291 H 34.17584 Z m 80.1774,10.74228 h 2.25751 v 6.16179 l -0.41507,0.0237 c -0.7246,0.0356 -1.6942,0.0712 -2.70069,0.0712 -4.77509,0 -7.5142,-2.39662 -7.5142,-7.0351 v -4.96805 h -1.8594 v -6.19369 h 1.8594 v -4.89938 h 7.12416 v 4.89938 h 2.81027 v 6.19369 h -2.81027 v 4.50282 c 0,0.87402 0.37356,1.2477 1.24782,1.2477 z m -32.658747,-4.34746 v 10.39563 h -7.233745 v -9.76519 c 0,-1.53399 -0.655811,-2.31147 -1.950127,-2.31147 -1.287778,0 -1.546199,0.8076 -1.630398,1.07325 -0.221761,0.79694 -0.259713,1.25102 -0.259713,2.21671 v 8.78647 h -7.13009 v -9.7652 c 0,-1.53398 -0.667675,-2.31147 -1.984395,-2.31147 -0.748316,0 -1.237156,0.36407 -1.428445,0.67597 -0.135194,0.20279 -0.235995,0.56924 -0.300034,0.82777 -0.128077,0.73883 -0.128077,1.0021 -0.128077,1.78742 v 8.78646 H 52.719791 V 113.9873 h 6.860064 l -0.0052,1.69089 c 0.486223,-0.99143 2.342541,-2.15945 4.945985,-2.15945 2.14307,0 3.851151,0.73647 4.937803,2.13003 l 0.192117,0.24667 0.207539,-0.2348 c 1.295971,-1.46687 2.781565,-2.09316 4.968876,-2.09316 2.06456,0 6.865752,0.78152 6.865752,8.01622 z m -40.026497,4.26575 c -1.730971,0 -3.271471,-1.30996 -3.271471,-3.11363 0,-1.82418 1.5405,-3.14885 3.271471,-3.14885 1.758713,0 3.271471,1.29515 3.271471,3.14885 0,1.86178 -1.485719,3.11363 -3.271471,3.11363 z m 2.896123,-12.01714 c -2.380958,-0.46726 -3.693303,-0.39135 -5.882972,0.0831 -3.941163,1.0436 -6.869073,4.11525 -6.869073,9.06455 0,6.21006 4.759444,9.46434 9.985892,9.46434 5.227287,0 9.725238,-3.25428 9.725238,-9.46434 0,-5.09565 -2.858534,-8.20109 -6.959085,-9.15124 z M 44.128891,92.802785 h 2.051517 c 1.986889,0 3.27053,0.942811 3.27053,2.400653 0,1.636098 -1.192088,2.574751 -3.27053,2.574751 h -2.051517 z m 0.0119,10.447225 h 1.190432 l 4.48407,7.66375 h 8.053806 l -4.978599,-8.3555 0.224131,-0.1352 c 2.393184,-1.44729 3.607449,-3.732544 3.607449,-6.792214 0,-5.297614 -3.609932,-8.335934 -9.905024,-8.335934 h -9.82817 v 23.619438 h 7.152029 z m 101.051929,17.77156 c 0.28935,-1.36297 1.36309,-2.3123 2.89126,-2.3123 1.69254,0 2.64258,0.99025 2.76615,2.3123 z m 3.03191,-7.50354 c -2.73022,0 -4.98121,0.88589 -6.71538,2.69417 -1.73428,1.77105 -2.58305,4.0588 -2.58305,6.90015 0,2.8781 0.92265,5.16598 2.76699,6.82578 1.84541,1.66064 4.17004,2.5094 6.97461,2.5094 2.82012,0 5.81433,-0.50046 8.20751,-3.04828 l -4.35481,-4.09722 c -0.91672,1.20761 -2.19288,1.42594 -3.92717,1.42594 -1.47587,0 -3.06856,-0.81236 -3.40061,-2.25016 h 11.92464 l 0.0356,-1.6974 c 0,-2.58376 -0.77559,-4.76039 -2.32464,-6.56821 -1.5494,-1.80864 -3.76363,-2.69417 -6.60496,-2.69417 z M 112.97312,93.590232 c 1.69253,0 2.6427,0.991427 2.76615,2.312306 h -5.65731 c 0.28937,-1.363092 1.36298,-2.312306 2.89116,-2.312306 z m 0.58346,13.738978 c 2.82012,0 5.81432,-0.50047 8.20762,-3.04817 l -4.35481,-4.09805 c -0.91672,1.20845 -2.19288,1.42677 -3.92716,1.42677 -1.47588,0 -3.06868,-0.81235 -3.40062,-2.250979 h 11.92464 l 0.0356,-1.69753 c 0,-2.582922 -0.77558,-4.759558 -2.32464,-6.568201 -1.54939,-1.807816 -3.76362,-2.693342 -6.60496,-2.693342 -2.7301,0 -4.98121,0.885888 -6.71537,2.693342 -1.73429,1.771881 -2.58294,4.058917 -2.58294,6.901087 0,2.878103 0.92265,5.165023 2.76687,6.825663 1.84541,1.66065 4.17004,2.50941 6.97461,2.50941 z"
                        id="Fill-78"
                        fill="#f2e93c"
                        style="
                          fill: #fa320a;
                          fill-opacity: 1;
                          fill-rule: evenodd;
                          stroke: none;
                          stroke-width: 0.264584;
                        "
                        sodipodi:nodetypes="cccccccccccccccccsccccccccccccccccccscccccccccccscccsscsccsccccsccccccscccccccccccccccssccsssccsssssccccsccsscccccccccccccccccsscccsccccccssccccccccccscccccccccccccccssccccccccccscccccsscsccssccscccccscccsccsssssccssscccsssccccccccsscccccsccccscsccsccccccsccssccsccccscscss"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            <div class="movie-plot text-left w-full">
              ${movie.Plot ? movie.Plot : "N/A"}
            </div>
            <div class="movie-genre-list flex gap-4 flex-wrap">
              
              ${
                movie.Genre.split(",").length > 0
                  ? movie.Genre.split(",")
                      .map((genre) => {
                        return `<div
                class="movie-genre border border-golden rounded-full px-2 py-1"
              >
                ${genre}
              </div>`;
                      })
                      .join("")
                  : ""
              }
            </div>
            <div class="movie-director flex gap-2">
              <span>Directors : </span>
              ${
                movie.Director.split(",").length > 0
                  ? movie.Director.split(",").map((director) => {
                      return `<span class="text-golden">${director}</span>`;
                    })
                  : ""
              }
            </div>
            <div class="movie-director flex gap-2 w-full">
              <div>Actors :</div>
              ${
                movie.Actors.split(",").length > 0
                  ? movie.Actors.split(",").map((actor) => {
                      return `<span class="text-golden">${actor}</span>`;
                    })
                  : ""
              }
            </div>
          </div>
        </div>`;
  loader1.classList.add("hidden");
}
