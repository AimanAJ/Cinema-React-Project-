import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { img_300, img_500, unavailable } from "../../api/config/DefaultImages";
import SingleData from "../SingleData/SingleData";
import "./SinglePage.css";
import SingleVideoPage from "./SingleVideoPage";
import Myloader from "react-spinners/ClipLoader";
import { AuthContext, Signupprovider } from '../Authetication/AuthContext';


import Carousel from "../Carousel/Carousel";
import $ from "jquery";
import { useContext } from "react";

const SinglePage = () => {
  $(function () {
    $(".ico").on("click", function () {
      $(".ico").toggleClass("press", 1000);
    });
  });

  // const [user_id, setUserid] = useState(0);
  const user_id = JSON.parse(localStorage.getItem('id'));
  const user_name = (localStorage.getItem('name'));

  const [time, setTime] = useState(null);
  const [day, setDay] = useState('');
  const [price, setPrice] = useState(5);
  const [num_seats, setSeats] = useState(1);
  const [movie_name, setMoviename] = useState(null);

  const auth = useContext(AuthContext);


  const [counters, setCounters] = useState(null);


  // console.log(localStorage.getItem('id'));



  const [content, setContent] = useState();
  const [similarMovies, setSimilarMovies] = useState();
  const [video, setVideo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line
  const [color, setColor] = useState("grey");
  const history = useHistory();

  const { id, mediaType } = useParams();

  const fetchData = async () => {
    try {
      const { data } = await axios.get(` 
      https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.REACT_APP_API_KEY}&page=1`);
      // eslint-disable-next-line
      setContent(data);
      setIsLoading(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        history.replace("/error");
      }
    }
  };
  const fetchSimilarMovies = async () => {
    try {
      const { data } = await axios.get(` 
     https://api.themoviedb.org/3/${mediaType}/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}`);
      // eslint-disable-next-line
      const dataSlice = data.results;
      const filter = dataSlice.slice(0, 7);

      // eslint-disable-next-line
      setSimilarMovies(filter);
      setIsLoading(true);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data } = await axios.get(` 
     https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}`);

      setVideo(data.results[0].key);
      setIsLoading(true);

      // eslint-disable-next-line
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    window.scroll(0, 0);

    fetchData();
    fetchSimilarMovies();
    fetchVideos();
    fetchCommints();

    // eslint-disable-next-line
  }, [id, setContent]);


  //Reservation Function

  console.log(auth.islogin);
  // const movie_name= content.name;


  useEffect(
    () => {
      axios.get(`https://62baba8b573ca8f83289f6c8.mockapi.io/reservations?id=${id}`)
        .then((res) => setCounters(res.data))
    }
    )

  const handleBook = () => {

    setMoviename(content.original_title || content.name)
    if ((user_id != null)) {
      if ((day != null) && (time != null) && (num_seats != 0)) {
        if (counters != null) {
          const d = counters.filter((s) => s.day == day);

          if (d.length > 0) {
            const sum = d.map(datum => parseInt(datum.num_seats)).reduce((a, b) => a + b)
            console.log(sum);

            if (sum < 5 && ((5 - sum) >= num_seats)) {

              axios.post(`https://62baba8b573ca8f83289f6c8.mockapi.io/reservations`, {
                user_id,
                time,
                day,
                num_seats,
                price,
                movie_name,
                id
              })

              window.alert('Booking Done Successfully');
            }
            else {
              window.alert('Tickets Cannot Be Booked');
            }

          } else {
            axios.post(`https://62baba8b573ca8f83289f6c8.mockapi.io/reservations`, {
              user_id,
              time,
              day,
              num_seats,
              price,
              movie_name,
              id
            })
            window.alert('Booking Done Successfully');

          }

        }
        else {
          axios.post(`https://62baba8b573ca8f83289f6c8.mockapi.io/reservations`, {
            user_id,
            time,
            day,
            num_seats,
            price,
            movie_name,
            id
          })  
          window.alert('Booking Done Successfully');
        }
      }
      else {
        window.alert('Please Fill All The Fields')
      }
    }
    else {
      window.alert('Please Login To Complete Your Reservation');
    }


  }


  // start comments



  const [comments, setcomments] = useState([]);
  const fetchCommints = () => {
    axios.get('https://62c47caf7d83a75e39fb0ca3.mockapi.io/comments')
      .then((response) => {
        setcomments(response.data);
      })
    // eslint-disable-next-line
    // const newdata = comments.filter((ep) => ep.movie_id === 68062);
    // setcomments(newdata);
    console.log(comments);
  }

  const [comment, setcomment] = useState(null);
  const AddCommints = () => {
    if ((user_id != null) && (comment != null)) {
      axios.post(`https://62c47caf7d83a75e39fb0ca3.mockapi.io/comments`, {
        user_id,
        id,
        comment,
        user_name,
      })
      window.location.href = `http://localhost:3000/movie/${id}`;
    }

  }



  // end comments
  return (
    <>
      {isLoading ? (
        <>
          <div>
            {content && (
              <div
                className="open__modal"
                style={{
                  backgroundImage: `url( https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${content.backdrop_path})`,
                }}
              >
                <img
                  className="poster__img"
                  src={
                    content.poster_path
                      ? `${img_300}/${content.poster_path}`
                      : unavailable
                  }
                  alt=""
                />
                <img
                  className="backdrop__img"
                  src={
                    content.backdrop_path
                      ? `${img_500}/${content.backdrop_path}`
                      : unavailable
                  }
                  alt=""
                />

                <div className="open__detailsPage">
                  <h3>{content.original_title || content.name}</h3>
                  <div
                    style={{
                      zIndex: "1000",
                      marginTop: "10px",
                      textAlign: "left",
                    }}
                    className="year"
                  >
                    {(
                      content.first_air_date ||
                      content.release_date ||
                      "-----"
                    ).substring(0, 4)}{" "}
                    .
                    <b className="title_me">
                      {mediaType === "tv" ? "Tv Series ." : "Movie ."}
                    </b>
                    <b className="vote_back">
                      <b className="tmdb">TMDB</b>
                      <b className="vote_ave">-⭐{content.vote_average}</b>
                    </b>
                  </div>
                  <h5
                    style={{
                      display: "flex",
                      fontSize: "12px",
                    }}
                    className="genreList"
                  >
                    {content.genres.map((n, i) => {
                      return (
                        <p
                          key={n.id}
                          style={{ fontSize: "13px", marginLeft: "6px" }}
                          className="mygenre"
                        >
                          {i > 0 && ", "}
                          {n.name}
                        </p>
                      );
                    })}
                  </h5>

                  <div className="videopage">
                    {content && (
                      <SingleVideoPage trailer={video} title={content.title} />
                    )}
                  </div>
                  <div className="tagline">
                    <h5>{content.tagline}</h5>
                  </div>
                  <div className="tagline ">
                    <h6>TICKET PRICE: <span style={{ color: '#2fc9f3' }}>5.00 JD</span></h6>
                  </div>
                  <div className="overview">
                    <p>{content.overview}</p>
                  </div>
                  <div className="other_lists">
                    <ul>
                      <li>
                        DURATION:{" "}
                        <span>
                          {mediaType === "tv"
                            ? `${content.episode_run_time[0]} min episodes`
                            : `${content.runtime} min`}
                        </span>
                      </li>
                      {mediaType === "tv" ? (
                        <li>
                          SEASONS: <span>{content.number_of_seasons}</span>
                        </li>
                      ) : (
                        ""
                      )}

                      <li>
                        STUDIO:
                        {content.production_companies.map((studio, i) => {
                          return (
                            <span key={studio.id}>
                              {" "}
                              {i > 0 && ",  "}
                              {studio.name}
                            </span>
                          );
                        })}
                      </li>
                      {mediaType === "movie" ? (
                        <li>
                          RELEASE DATE: <span>{content.release_date}</span>
                        </li>
                      ) : (
                        ""
                      )}
                      <li>
                        STATUS: <span>{content.status}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Start Reservation form */}

          <div className="all__cast px-5 pt-5 mt-5 mb-5 ">
            <div className="cast__title mb-4">
              <h2>Reservation</h2>

            </div>
            <div class='col-12'>
              {/* <Carousel mediaType={mediaType} id={id} /> */}
              <div class='row'>
                <div class="form-group col-3 mt-1">
                  <label >Day</label>
                  <select class="form-control" onChange={(e) => setDay(e.target.value)} required>
                    <option value="" selected disabled hidden>Choose option</option>
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                  </select>
                </div>
                <div class="form-group col-3 mt-1">
                  <label>Time</label>

                  <select class="form-control" onChange={(e) => setTime(e.target.value)} required>
                    <option value="" selected disabled hidden>Choose option</option>
                    <option>13:00 - 15:00</option>
                    {/* <option>15:30 - 17:00</option>
                    <option>19:00 - 21:00</option> */}
                  </select>
                </div>

                <div class="form-group col-3">
                  <label>Number of Seats</label>
                  <input type='number' class='form-control' min='1' max='150' placeholder="1" onChange={(e) => { setSeats(e.target.value); setPrice(e.target.value * 5); }} required></input>
                </div>
                <div class="form-group col-3">
                  <label>Price</label>
                  <input type='text' class='form-control' min='1' max='150' placeholder="5" value={price + ' JD'} required disabled></input>
                </div>
                <div class="col-12">
                  <br />
                  <div class="btn btn-success px-4 mt-2" data-toggle="modal" onClick={handleBook}>Book Now</div>
                </div>

              </div>

            </div>
          </div>

          {/* End Reservation form */}



          {/*  comments */}

          <div class="container-fluid " style={{ backgroundColor: "#0f022b00", color: "white" }}>
            <div className="cast__title mb-4">
              <h2>Comments</h2>
            </div>

            <div class="d-flex justify-content-center row" style={{ textAlign: "left" }}>
              <div class="col-md-8" >
                <div class="d-flex flex-column comment-section">
                  {comments.filter((ep) => (ep.id === id)).map((c) => (
                    <div class=" p-2">
                      <div class="d-flex flex-row user-info" >
                        <img class="rounded-circle" src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" width="40" />
                        <div class="d-flex flex-column justify-content-start ml-2">
                          <span class="d-block font-weight-bold name">{c.user_name}</span>
                        </div>
                      </div>
                      <div class="d-flex flex-row user-info mt-2 pl-5" >
                        <div class="d-flex flex-column justify-content-start ml-2"><span >{c.comment}</span></div>
                      </div>


                    </div>


                  ))}

                  <div class=" p-2">
                    <div class="d-flex flex-row align-items-start">
                      <img class="rounded-circle" src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" width="40" />
                      <textarea class="form-control ml-1 shadow-none textarea" onChange={(e) => setcomment(e.target.value)} disabled={user_id != null ? false : true}></textarea>
                    </div>
                    {user_id == null && (
                      <div class="alert alert-warning ml-5 mt-1" role="alert">
                        You need to be logged in to be able to comment
                      </div>
                    )}
                    <div class="mt-2 text-left pl-5">
                      <div class="btn btn-success px-4 mt-2 col-lg-" data-toggle="modal" onClick={AddCommints} >Send</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          {/*  end comments */}


          <div className="similar__shows">
            <div className="btn__title">
              <h5>You May Also Like </h5>
            </div>
            <div className="similar">
              {similarMovies &&
                similarMovies.map((n) => (
                  <SingleData key={n.id} {...n} mediaType="movie" />
                ))}
            </div>
          </div>
        </>
      ) : (
        <div className="load_app" style={{ height: "500px" }}>
          <Myloader color={color} size={60} />
          <p
            className="pt-4 text-secondary text-loading"
            style={{ textTransform: "capitalize", fontSize: "1rem" }}
          >
            Loading Please Wait...
          </p>
        </div>
      )}
    </>
  );
};

export default SinglePage;


