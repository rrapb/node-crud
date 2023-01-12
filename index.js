const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
        // match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'service', 'network']
    },
    author: String,
    tags: {
        type: Array,
        validate: [{
            isAsync: true,
            validator: function (v) {
                // return new Promise((resolve, reject) =>{
                //     setTimeout(() =>{
                //         const result = v && v.length > 0;
                //         resolve(result);
                //     },4000);
                // })

                return v && v.length > 0;

            },
            message: 'A course should have 1 object'
        },{
            isAsync: true,
            validator: function (v) {
                // return new Promise((resolve, reject) =>{
                //     setTimeout(() =>{
                //         const result = v && v.length > 0;
                //         resolve(result);
                //     },4000);
                // })

                const index = v?.length;
                for (let i = 0; i <= index; i++) {
                    if (v[i]?.length <= 3) {
                        return false;
                    }
                    return true;
                }
            },
            message: 'A course should have more than 3 characters'
        }]

    },
    date: {type: Date, default: Date.now},
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () {
            return this.isPublished;
        }
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'React',
        author: 'Rrap',
        tags: ['abcd'],
        isPublished: false,
        price: 20,
        category: 'web'
    });

    try {
        const result = await course.save();
        console.log(result);
    } catch (ex) {
        console.log(ex.message);
    }

}

// createCourse();


async function getCourses() {
    const courses = await Course

        // Starts with Rrap
        // .find({ author: /^Rrap/ })

        // Ends with Braina
        // .find({ author: /Braina$/i})

        // Contains Rrap
        // .find({ author: /.*Rrap.*/i})
        // .find({ price: { $in: [10,15,20] } })

        .find({author: 'Rrap', isPublished: true})
        .limit(10)
        .sort({name: 1})
        // .select({name: 1, tags:   1});
        .count();
    console.log(courses);
}

// getCourses();


async function updateCourse(id) {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Testing',
            isPublished: true
        }
    }, {new: true});
    console.log(course);

}

updateCourse('63c022662db75c052c29472f');

async function removeCourse(id) {
    const result = await Course.deleteMany({_id: id});
    const course = await Course.findByIdAndRemove(id);
    console.log(result);
}

// removeCourse('63c022662db75c052c29472f');