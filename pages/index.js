export default function Home(){
  return null
}

export async function getServerSideProps(){
  return {
    redirect: {
      destination: '/api/prototype',
      permanent: false,
    },
  }
}
