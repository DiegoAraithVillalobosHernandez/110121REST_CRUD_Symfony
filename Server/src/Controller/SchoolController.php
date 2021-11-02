<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SchoolController extends AbstractController
{
    /**
     * @Route("/school", name="school")
     */
    public function findAllSchools()
    {
        $em = $this->getDoctrine()->getManager(); //instanciando la bd
        $query = $em->createQuery('SELECT s.id, s.name, s.street, s.created, s.updated,s.status FROM App:School s');
        $listSchool = $query->getResult();
        
        if (count($listSchool) > 0) {
            $data = [
                'status' => 200,
                'message' => 'Se encontraron ' . count($listSchool) . ' resultados.',
                'listSchool' => $listSchool
            ];
        }else{
            $data = [
                'status' => 200,
                'message' => 'No se encontraron resultados.'
            ];
        }
        return new JsonResponse($data);
    }
    
    public function schoolById($id)
    {
        $em = $this->getDoctrine()->getManager();
        //$school = $em ->getRepository('App:School') ->findOneBy(['id' => $id]);
        $query = $em->createQuery('SELECT s.id, s.name, s.street, s.created, s.updated,s.status FROM App:School s WHERE s.id = :p');
        $query->setParameter(':p', $id);
        $school = $query->getResult();

        if (sizeof($school) > 0) { //quitar if si no funciona
            $data = [
                'status' => 200,
                'message' => 'Se encontro la escuela correctamente.',
                'school' => $school
            ];
        } else {
            $data = [
                'status' => 400,
                'message' => 'No se encontro la escuela.',
                'school' => $school
            ];
        }
        return new JsonResponse($data);
    }

    public function createSchool(Request $request)
    {
        $em = $this->getDoctrine()->getManager(); //instanciación de la bd
        $name = $request->get('name', null); //vemos si insertaron datos y sino colocamos null
        $street = $request->get('street', null);

        $school = new \App\Entity\School(); //Crea una instancia de school

        $school->setName($name); //obtenemos valores ingresados en el form y seteamos
        $school->setStreet($street);
        $school->setStatus(1); //se le asigna status ya que no se llena en el formulario
        $school->setCreated(new \DateTime());//le asignamos la fecha actual
        $school->setUpdated(new \DateTime());//se podría haber puesto directo en la bd

        $em->persist($school); //crea la sentencia de insercion
        $em->flush(); //es como un commit para que se inserte en la bd

        $data = [
            'status' => 200,
            'message' => 'Se ha guardado la escuela correctamente.',
        ];

        return new JsonResponse($data);
    }

    public function deleteSchool($id)
    {
        $em = $this->getDoctrine()->getManager();
        //hacemos consulta
        $query= $em->createQuery('UPDATE App:School s SET s.status=0 WHERE s.id = :p');
        $query->setParameter(':p',$id);
        $school = $query->getResult();

        $data = [
            'status' => 200,
            'message' => 'Se deshabilito la escuela correctamente.',
            'school' => $school
        ];
        return new JsonResponse($data);
    }

    public function updateSchool(Request $request, $id){//request valores formulario
        $em = $this->getDoctrine()->getManager(); //instanciación de la bd

        $name = $request->get('name', null); //obtencion de valores
        $street = $request->get('street', null);
        $query = $em->createQuery('UPDATE App:School s SET s.name = :name, s.street = :street, s.updated = current_timestamp() WHERE s.id = :id');

        $query->setParameter(':name',$name);
        $query->setParameter(':street',$street);
        $query->setParameter(':id',$id);
        $flag = $query->getResult();

        if($flag == 1){
            $data = ['status' => 200,'message' => 'Se ha actualizado la escuela correctamente.'];
        }else{
            $data = ['status' => 400,'message' => 'No se ha actualizado la escuela correctamente.'];
        }

        return new JsonResponse($data);
    }
}
