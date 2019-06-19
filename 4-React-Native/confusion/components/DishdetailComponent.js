import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, Button, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites,
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {

    const dish = props.dish;

    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}>
                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
                <View style={styles.cardRow}>
                    <Icon
                        raised
                        reverse
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon 
                        style={styles.cardItem}
                        raised
                        reverse
                        type='font-awesome'
                        name='pencil'
                        color='#512DA8'
                        onPress={() => props.onShowModal()}
                    />
                </View>
            </Card>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating 
                    style={{ alignItems: 'flex-start', paddingVertical: '5%' }}
                    imageSize={12}
                    startingValue={+item.rating}
                    readonly
                />
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Card title='Comments' >
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class DishDetail extends Component {

    constructor (props) {
        super(props);
        this.state = {
            favorites: [],
            rating: 5,
            showModal: false,
            author: '',
            comment: '',
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: "Dish Details"
    };

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleComment(dishId) {
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment)
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            rating: 5,
            author: '',
            comment: '',
        });
    }


    render() {
        const dishId = this.props.navigation.getParam('dishId', '');

        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onShowModal={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                        <Modal 
                            animationType={"slide"} 
                            transparent={false} 
                            visible={this.state.showModal} 
                            onDismiss={() => this.toggleModal()}
                            onRequestClose={() => this.toggleModal()}>
                            <View style={styles.modal}>
                                <Rating
                                    fractions={0}
                                    startingValue={this.state.rating}
                                    showRating
                                    onFinishRating={(rating) => this.setState({ rating: rating })}
                                    style={{ paddingVertical: 10 }}
                                />

                                <Input
                                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                                    placeholder=' Author'
                                    onChangeText={(author) => this.setState({ author: author })}
                                />
                                <Input
                                    leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                                    placeholder=' Comment'
                                    onChangeText={(comment) => this.setState({ comment: comment })}
                                />
                                <View style={styles.modal}>
                                    <Button
                                        onPress={() => { this.handleComment(dishId); this.resetForm(); }}
                                        title="Submit"
                                        color="#512DA8"
                                        
                                    />
                                </View>
                                <View style={{marginTop: 0 , marginLeft: 20, marginRight: 20}}>
                                    <Button
                                        onPress={() => { this.toggleModal(); this.resetForm(); }}
                                        color="#808080"
                                        title="Cancel"
                                    />
                                </View>
                            </View>

                        </Modal>
                    </KeyboardAvoidingView>    
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);