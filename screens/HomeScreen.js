import axios from "axios";
import {useEffect, useState} from "react";
import {Button, FlatList, Text, View} from "react-native";
import {Caption, Card, List, Paragraph, Snackbar, Title} from "react-native-paper";

const styles = {
    app: {
        flex: 4, // the number of columns you want to devide the screen into
        marginHorizontal: "auto",
        width: 400,
        backgroundColor: "red"
    },
    row: {
        flexDirection: "row"
    },
    "1col":  {
        backgroundColor:  "lightblue",
        borderColor:  "#fff",
        borderWidth:  1,
        flex:  1
    },
    "2col":  {
        backgroundColor:  "green",
        borderColor:  "#fff",
        borderWidth:  1,
        flex:  2
    },
    "3col":  {
        backgroundColor:  "orange",
        borderColor:  "#fff",
        borderWidth:  1,
        flex:  3
    },
    "4col":  {
        flex:  4
    }
};

const Col = ({ numRows, children }) => {
    return  (
        <View style={styles[`${numRows}col`]}>{children}</View>
    )
}

const Row = ({ children }) => (
    <View style={styles.row}>{children}</View>
)

const HomeScreen = ({ navigation }) => {
    const [drinks, setDrinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(false);

    const handlePress = () => setExpanded(!expanded);

    useEffect(() => {
        loadDrinks()

        return navigation.addListener('focus', () => {
            loadDrinks();
        });
    }, [])

    function loadDrinks () {
        axios.get('http://localhost:1337/api/drinks?populate=*')
            .then(({ data }) => {
                setDrinks(data.data);
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setError('An error occurred, please try again later.');
                setLoading(false);
            });
    }
console.log(drinks)
    return (
        <View>
            {!loading && !drinks.length && <Caption style={{textAlign: 'center', marginTop: 10}}>You have no drinks</Caption>}

            <List.AccordionGroup>
                {
                    drinks.map((item) => {
                        return (
                            <List.Accordion
                                key={item.id}
                                id={item.id}
                                styles={styles.app}
                                title={item.attributes.name}
                                subheader={'test'}
                                right={props => <Text>{'$' + Number(item.attributes.price).toFixed(2)}</Text>}
                                expanded={expanded}
                                onPress={handlePress}
                            >
                                {
                                    item.attributes.ingredients.map((item) => {
                                       return (
                                           <View key={item.id} styles={styles.app}>
                                               <Row>
                                                   <Col numRows={1}>
                                                       {item.amount + 'oz'}
                                                   </Col>
                                                   <Col numRows={3}>
                                                       {item.name}
                                                   </Col>
                                               </Row>
                                           </View>
                                        )
                                    })
                                }
                            </List.Accordion>
                        )
                    })
                }

            </List.AccordionGroup>
            <Snackbar visible={error.length > 0} onDismiss={() => setError('')}>{error}</Snackbar>
        </View>
    )
}

export default HomeScreen;