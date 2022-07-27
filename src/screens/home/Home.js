import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    upcomingMoviesHeading: {
        textAlign: 'center',
        background: '#ff9999',
        padding: '8px',
        fontSize: '1rem'
    },
    gridListUpcomingMovies: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        width: '100%'
    },
    gridListMain: {
        transform: 'translateZ(0)',
        cursor: 'pointer'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 240,
        maxWidth: 240
    },
    title: {
        color: theme.palette.primary.light,
    }
});

class Home extends Component {

    constructor() {
        super();
        this.state = {
            artists: [],
            listGenres: [],
            artistsList: [],
            startReleaseDate: "",
            endReleaseDate: "",
            movieName: "",
            upcomingMoviesList: [],
            listReleasedMovies: [],
            genres: []
        }
    }

    componentWillMount() {

        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(this.props.baseUrl + "movies?status=PUBLISHED", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.setState({
                    upcomingMoviesList: JSON.parse(result).movies
                })
            })

        fetch(this.props.baseUrl + "movies?status=RELEASED", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.setState({
                    listReleasedMovies: JSON.parse(result).movies
                })
            })

        fetch(this.props.baseUrl + "genres", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.setState({
                    listGenres: JSON.parse(result).genres
                })
            })


        fetch(this.props.baseUrl + "artists", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.setState({
                    artistsList: JSON.parse(result).artists
                })
            })
    }

    filterApplyHandler = () => {
        let queryString = "?status=RELEASED";
        if (this.state.movieName !== "") {
            queryString += "&title=" + this.state.movieName;
        }
        if (this.state.genres.length > 0) {
            queryString += "&genres=" + this.state.genres.toString();
        }
        if (this.state.artists.length > 0) {
            queryString += "&artists=" + this.state.artists.toString();
        }
        if (this.state.startReleaseDate !== "") {
            queryString += "&start_date=" + this.state.startReleaseDate;
        }
        if (this.state.endReleaseDate !== "") {
            queryString += "&end_date=" + this.state.endReleaseDate;
        }

        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(this.props.baseUrl + "movies" + encodeURI(queryString), requestOptions)
            .then(response => response.text())
            .then(result => {
                this.setState({
                    listReleasedMovies: JSON.parse(result).movies
                })
            })
    }

    releaseDateStartMethod = event => {
        this.setState({ startReleaseDate: event.target.value });
    }

    releaseDateEndMethod = event => {
        this.setState({ endReleaseDate: event.target.value });
    }

    movieClickMethod = (movieId) => {
        this.props.history.push('/movie/' + movieId);
    }

    changeMovieName = event => {
        this.setState({ movieName: event.target.value });
    }

    genreSelectMethod = event => {
        this.setState({ genres: event.target.value });
    }

    artistSelectMethod = event => {
        this.setState({ artists: event.target.value });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header id={this.props.id} baseUrl={this.props.baseUrl} />

                <div className={classes.upcomingMoviesHeading}>
                    <span>Upcoming Movies</span>
                </div>

                <GridList cols={5} className={classes.gridListUpcomingMovies} >
                    {this.state.upcomingMoviesList.map(movie => (
                        <GridListTile key={"upcoming" + movie.id}>
                            <img src={movie.poster_url} className="poster-div" alt={movie.title} />
                            <GridListTileBar title={movie.title} />
                        </GridListTile>
                    ))}
                </GridList>

                <div className="display-flex-view">
                    <div className="left">
                        <GridList cellHeight={350} cols={4} className={classes.gridListMain}>
                            {this.state.listReleasedMovies.map(movie => (
                                <GridListTile onClick={() => this.movieClickMethod(movie.id)} className="released-movie-item" key={"grid" + movie.id}>
                                    <img src={movie.poster_url} className="poster-div" alt={movie.title} />
                                    <GridListTileBar
                                        title={movie.title}
                                        subtitle={<span>Release Date: {new Date(movie.release_date).toDateString()}</span>}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                    <div className="right">
                        <Card>
                            <CardContent>
                                <FormControl className={classes.formControl}>
                                    <Typography className={classes.title} color="textSecondary">
                                        FIND MOVIES BY:
                                    </Typography>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                                    <Input id="movieName" onChange={this.changeMovieName} />
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-multiple-checkbox">Genres</InputLabel>
                                    <Select
                                        multiple
                                        input={<Input id="select-multiple-checkbox-genre" />}
                                        renderValue={selected => selected.join(',')}
                                        value={this.state.genres}
                                        onChange={this.genreSelectMethod}
                                    >
                                        {this.state.listGenres.map(genre => (
                                            <MenuItem key={genre.id} value={genre.genre}>
                                                <Checkbox checked={this.state.genres.indexOf(genre.genre) > -1} />
                                                <ListItemText primary={genre.genre} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-multiple-checkbox">Artists</InputLabel>
                                    <Select
                                        multiple
                                        input={<Input id="select-multiple-checkbox" />}
                                        renderValue={selected => selected.join(',')}
                                        value={this.state.artists}
                                        onChange={this.artistSelectMethod}
                                    >
                                        {this.state.artistsList.map(artist => (
                                            <MenuItem key={artist.id} value={artist.first_name + " " + artist.last_name}>
                                                <Checkbox checked={this.state.artists.indexOf(artist.first_name + " " + artist.last_name) > -1} />
                                                <ListItemText primary={artist.first_name + " " + artist.last_name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="startReleaseDate"
                                        label="Release Date Start"
                                        type="date"
                                        defaultValue=""
                                        InputLabelProps={{ shrink: true }}
                                        onChange={this.releaseDateStartMethod}
                                    />
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="endReleaseDate"
                                        label="Release Date End"
                                        type="date"
                                        defaultValue=""
                                        InputLabelProps={{ shrink: true }}
                                        onChange={this.releaseDateEndMethod}
                                    />
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formControl}>
                                    <Button onClick={() => this.filterApplyHandler()} variant="contained" color="primary">
                                        APPLY
                                    </Button>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div >
        )
    }
}

export default withStyles(styles)(Home);